import { FormFieldType, type FormField } from "@prisma/client";
import { badRequest } from "@/lib/api/errors";

export type AnswerValue = string | number | boolean | string[];

/**
 * Validates a submission against the form's own field definitions.
 *
 * These rules live in the database rather than in a static schema, so Zod can
 * only check the envelope. Everything specific to this form is checked here:
 * that required questions were answered, that choices come from the offered
 * options, and that no answer was sent for a question the form does not ask.
 *
 * Returns the cleaned answers, keyed by field id, so nothing the caller
 * invented is ever persisted.
 */
export function validateAnswers(
  fields: FormField[],
  submitted: Record<string, AnswerValue>,
): Record<string, AnswerValue> {
  const problems: Record<string, string[]> = {};
  const clean: Record<string, AnswerValue> = {};
  const known = new Set(fields.map((f) => f.id));

  for (const key of Object.keys(submitted)) {
    if (!known.has(key)) {
      (problems[key] ??= []).push("That question is not part of this form.");
    }
  }

  for (const field of fields) {
    const raw = submitted[field.id];
    const missing =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && raw.trim() === "") ||
      (Array.isArray(raw) && raw.length === 0);

    if (missing) {
      if (field.required) (problems[field.id] ??= []).push(`${field.label} is required.`);
      continue;
    }

    switch (field.type) {
      case FormFieldType.CHECKBOX: {
        // The only field that legitimately carries several values.
        const values = Array.isArray(raw) ? raw : [String(raw)];
        const unknown = values.filter((v) => !field.options.includes(v));
        if (unknown.length) {
          (problems[field.id] ??= []).push(`${field.label}: unexpected choice.`);
        } else {
          clean[field.id] = values;
        }
        break;
      }
      case FormFieldType.SELECT:
      case FormFieldType.RADIO: {
        const value = String(raw);
        if (!field.options.includes(value)) {
          (problems[field.id] ??= []).push(`${field.label}: unexpected choice.`);
        } else {
          clean[field.id] = value;
        }
        break;
      }
      case FormFieldType.NUMBER: {
        const value = typeof raw === "number" ? raw : Number(String(raw));
        if (!Number.isFinite(value)) {
          (problems[field.id] ??= []).push(`${field.label} must be a number.`);
        } else {
          clean[field.id] = value;
        }
        break;
      }
      case FormFieldType.DATE: {
        const value = String(raw);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
          (problems[field.id] ??= []).push(`${field.label} must be a date, as YYYY-MM-DD.`);
        } else {
          clean[field.id] = value;
        }
        break;
      }
      case FormFieldType.EMAIL: {
        const value = String(raw).trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          (problems[field.id] ??= []).push(`${field.label} must be an email address.`);
        } else {
          clean[field.id] = value;
        }
        break;
      }
      default: {
        // TEXT, TEXTAREA and PHONE are free text. Bounded so one submission
        // cannot carry a document.
        const value = String(raw).trim();
        if (value.length > 5000) {
          (problems[field.id] ??= []).push(`${field.label} is too long.`);
        } else {
          clean[field.id] = value;
        }
      }
    }
  }

  if (Object.keys(problems).length) {
    throw badRequest("invalid_answers", "Some answers need fixing.", problems);
  }
  return clean;
}
