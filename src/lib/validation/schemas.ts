import { z } from "zod";
import { Language, MembershipRole, Visibility } from "@prisma/client";

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
  .and(audience.or(z.object({}).strict()));

export const createScheduleEntrySchema = z.object({
  startsAt: z.string().datetime({ message: "Use an ISO 8601 timestamp." }).transform((s) => new Date(s)),
  serviceName: z.string().trim().min(1, "Name the service.").max(160),
  note: z.string().trim().max(2000).optional(),
});

export const createFormSchema = z
  .object({
    title: z.string().trim().min(1, "Give the form a title.").max(200),
    description: z.string().trim().max(8000).optional(),
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
  .and(audience);

export const createClergySchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(160),
  title: z.string().trim().min(1, "Enter a title, such as Diacon.").max(120),
  photoUrl: z.string().trim().url().max(600).optional(),
  sortOrder: z.number().int().min(0).max(999).default(0),
});
