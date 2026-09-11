import { z } from "zod";
import { Language, MembershipRole, PollResultsVisibility, Visibility } from "@prisma/client";

export const MIN_AGE_YEARS = 13;

/** Full years elapsed, counting the month and day, not just the year difference. */
export function ageOn(dateOfBirth: Date, on: Date = new Date()): number {
  let age = on.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const monthDelta = on.getUTCMonth() - dateOfBirth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && on.getUTCDate() < dateOfBirth.getUTCDate())) age -= 1;
  return age;
}

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(320);

const password = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(200, "That password is too long.");

/**
 * Plain yyyy-mm-dd, parsed as UTC midnight so a birthday never shifts a day
 * across timezones. The minimum age is 13, which keeps the platform clear of
 * COPPA rather than merely discouraging young sign-ups.
 */
const dateOfBirth = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD.")
  .transform((s) => new Date(`${s}T00:00:00.000Z`))
  .refine((d) => !Number.isNaN(d.getTime()), "That is not a real date.")
  .refine((d) => d <= new Date(), "That date is in the future.")
  .refine((d) => ageOn(d) >= MIN_AGE_YEARS, `You must be at least ${MIN_AGE_YEARS} to sign up.`);

export const registerSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1, "Enter your first name.").max(80),
  lastName: z.string().trim().min(1, "Enter your last name.").max(80),
  dateOfBirth,
  phone: z.string().trim().max(32).optional(),
  preferredLanguage: z.nativeEnum(Language).default(Language.RO),
});

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password.") });
export const verifyEmailSchema = z.object({ email, code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code.") });
export const resendSchema = z.object({ email });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: password,
});

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #AB1F21.");

export const createParishSchema = z.object({
  name: z.string().trim().min(2, "Enter the parish name.").max(160),
  patronSaint: z.string().trim().max(160).optional(),
  jurisdiction: z.string().trim().max(160).optional(),
  city: z.string().trim().min(1, "Enter the city.").max(120),
  state: z.string().trim().max(120).optional(),
  country: z.string().trim().min(1, "Enter the country.").max(120),
  addressLine1: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().max(32).optional(),
  phone: z.string().trim().max(32).optional(),
  contactEmail: z.string().trim().toLowerCase().email().max(320).optional(),
});

export const updateParishSchema = createParishSchema.partial().extend({
  website: z.string().trim().url().max(400).optional(),
  googleMapsUrl: z.string().trim().url().max(600).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  logoUrl: z.string().trim().url().max(600).optional(),
  themePrimary: hex.optional(),
  themeSecondary: hex.optional(),
  shortHistory: z.string().trim().max(8000).optional(),
  donationUrlPaypal: z.string().trim().url().max(600).optional(),
  zelleHandle: z.string().trim().max(120).optional(),
  venmoHandle: z.string().trim().max(120).optional(),
});

export const joinSchema = z.object({
  code: z.string().trim().toUpperCase().min(4, "Enter the parish code.").max(16),
});

/** A delegate admin can be appointed or stood down; priesthood is not granted here. */
export const setRoleSchema = z.object({
  role: z.enum([MembershipRole.ADMIN, MembershipRole.MEMBER]),
});

/**
 * BY_AGE is the only visibility that carries a range, and a range that reads
 * backwards would silently match nobody, so it is rejected outright.
 */
const audience = z
  .object({
    visibility: z.nativeEnum(Visibility).default(Visibility.ALL),
    minAge: z.number().int().min(0).max(120).optional(),
    maxAge: z.number().int().min(0).max(120).optional(),
  })
  .refine((v) => v.visibility === Visibility.BY_AGE || (v.minAge === undefined && v.maxAge === undefined), {
    message: "An age range only applies when visibility is BY_AGE.",
    path: ["visibility"],
  })
  .refine((v) => v.visibility !== Visibility.BY_AGE || v.minAge !== undefined || v.maxAge !== undefined, {
    message: "Set at least one end of the age range.",
    path: ["minAge"],
  })
  .refine((v) => v.minAge === undefined || v.maxAge === undefined || v.minAge <= v.maxAge, {
    message: "The lowest age must not be above the highest.",
    path: ["maxAge"],
  });

/**
 * The same audience rules, but for a PATCH where every field is optional.
 * Omitting visibility entirely must stay legal, so the cross-field checks only
 * fire once it is present.
 */
const audiencePartial = z
  .object({
    visibility: z.nativeEnum(Visibility).optional(),
    minAge: z.number().int().min(0).max(120).optional(),
    maxAge: z.number().int().min(0).max(120).optional(),
  })
  .refine(
    (v) => v.visibility !== Visibility.BY_AGE || v.minAge !== undefined || v.maxAge !== undefined,
    { message: "Set at least one end of the age range.", path: ["minAge"] },
  )
  .refine(
    (v) =>
      v.visibility === undefined ||
      v.visibility === Visibility.BY_AGE ||
      (v.minAge === undefined && v.maxAge === undefined),
    { message: "An age range only applies when visibility is BY_AGE.", path: ["visibility"] },
  )
  .refine((v) => v.minAge === undefined || v.maxAge === undefined || v.minAge <= v.maxAge, {
    message: "The lowest age must not be above the highest.",
    path: ["maxAge"],
  });

export const createAnnouncementSchema = z
  .object({
    title: z.string().trim().min(1, "Give the announcement a title.").max(200),
    body: z.string().trim().min(1, "Write the announcement.").max(20_000),
    publish: z.boolean().default(false),
  })
  .and(audience);

export const updateAnnouncementSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    body: z.string().trim().min(1).max(20_000).optional(),
    publish: z.boolean().optional(),
  })
  .and(audiencePartial);

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.")
  .max(80);

export const createArticleSchema = z
  .object({
    title: z.string().trim().min(1, "Give the article a title.").max(200),
    /// Optional: derived from the title when omitted, then made unique per parish.
    slug: slug.optional(),
    excerpt: z.string().trim().max(500).optional(),
    body: z.string().trim().min(1, "Write the article.").max(80_000),
    coverImageUrl: z.string().trim().url().max(600).optional(),
    publish: z.boolean().default(false),
  })
  .and(audience);

export const updateArticleSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    slug: slug.optional(),
    excerpt: z.string().trim().max(500).optional(),
    body: z.string().trim().min(1).max(80_000).optional(),
    coverImageUrl: z.string().trim().url().max(600).optional(),
    publish: z.boolean().optional(),
  })
  .and(audiencePartial);

const isoDate = z
  .string()
  .datetime({ message: "Use an ISO 8601 timestamp." })
  .transform((value) => new Date(value));

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1, "Give the event a title.").max(200),
    description: z.string().trim().min(1, "Describe the event.").max(20_000),
    startsAt: isoDate,
    endsAt: isoDate.optional(),
    location: z.string().trim().max(300).optional(),
    coverImageUrl: z.string().trim().url().max(600).optional(),
    registrationUrl: z.string().trim().url().max(600).optional(),
    publish: z.boolean().default(false),
  })
  .and(audience)
  // An event that ends before it starts would sort and display nonsensically,
  // and no later validation would catch it.
  .refine((v) => !v.endsAt || v.endsAt >= v.startsAt, {
    message: "The end time must not be before the start time.",
    path: ["endsAt"],
  });

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(20_000).optional(),
    startsAt: isoDate.optional(),
    endsAt: isoDate.nullable().optional(),
    location: z.string().trim().max(300).optional(),
    coverImageUrl: z.string().trim().url().max(600).optional(),
    registrationUrl: z.string().trim().url().max(600).optional(),
    publish: z.boolean().optional(),
  })
  .and(audiencePartial);

export const createScheduleEntrySchema = z.object({
  startsAt: z.string().datetime({ message: "Use an ISO 8601 timestamp." }).transform((s) => new Date(s)),
  serviceName: z.string().trim().min(1, "Name the service.").max(160),
  note: z.string().trim().max(2000).optional(),
});

export const createPollSchema = z
  .object({
    question: z.string().trim().min(1, "Ask a question.").max(400),
    options: z
      .array(z.string().trim().min(1, "An option cannot be blank.").max(200))
      .min(2, "A poll needs at least two options.")
      .max(20)
      // Two identical options would split the vote and mean nothing.
      .refine((o) => new Set(o.map((x) => x.toLowerCase())).size === o.length, {
        message: "Two options cannot be the same.",
      }),
    allowMultiple: z.boolean().default(false),
    resultsVisibility: z.nativeEnum(PollResultsVisibility).default(PollResultsVisibility.AFTER_VOTE),
    closesAt: isoDate.optional(),
    publish: z.boolean().default(false),
  })
  .and(audience)
  // AFTER_CLOSE with no closing time would hide the results forever.
  .refine((v) => v.resultsVisibility !== PollResultsVisibility.AFTER_CLOSE || v.closesAt !== undefined, {
    message: "Set a closing time, or results would never become visible.",
    path: ["closesAt"],
  });

export const updatePollSchema = z
  .object({
    question: z.string().trim().min(1).max(400).optional(),
    resultsVisibility: z.nativeEnum(PollResultsVisibility).optional(),
    closesAt: isoDate.nullable().optional(),
    publish: z.boolean().optional(),
  })
  .and(audiencePartial);

/**
 * Votes always arrive as a list, even for a single-choice poll, so the handler
 * has one shape to validate rather than two.
 */
export const voteSchema = z.object({
  optionIds: z
    .array(z.string().min(1))
    .min(1, "Choose an option.")
    .max(20)
    .refine((o) => new Set(o).size === o.length, { message: "The same option was sent twice." }),
});

export const createFormSchema = z
  .object({
    title: z.string().trim().min(1, "Give the form a title.").max(200),
    description: z.string().trim().max(8000).optional(),
    opensAt: isoDate.optional(),
    closesAt: isoDate.optional(),
    publish: z.boolean().default(false),
    fields: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(200),
          type: z.enum(["TEXT", "TEXTAREA", "NUMBER", "DATE", "EMAIL", "PHONE", "SELECT", "RADIO", "CHECKBOX"]),
          required: z.boolean().default(false),
          options: z.array(z.string().trim().min(1).max(200)).max(50).default([]),
        }),
      )
      .min(1, "Add at least one question.")
      .max(60),
  })
  .and(audience)
  .refine((v) => !v.opensAt || !v.closesAt || v.closesAt > v.opensAt, {
    message: "The closing time must be after the opening time.",
    path: ["closesAt"],
  });

export const updateFormSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(8000).optional(),
    opensAt: isoDate.nullable().optional(),
    closesAt: isoDate.nullable().optional(),
    publish: z.boolean().optional(),
  })
  .and(audiencePartial);

/**
 * Answers arrive keyed by FormField id. The values are checked against the
 * form's own field definitions in the handler, since the rules depend on rows
 * in the database rather than on anything knowable here.
 */
export const submitFormSchema = z.object({
  answers: z.record(z.string().min(1), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
});

export const createClergySchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(160),
  title: z.string().trim().min(1, "Enter a title, such as Diacon.").max(120),
  photoUrl: z.string().trim().url().max(600).optional(),
  sortOrder: z.number().int().min(0).max(999).default(0),
});
