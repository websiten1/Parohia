/**
 * The jurisdiction code for client components.
 *
 * Server code reads the full config from src/lib/jurisdiction.ts, which uses
 * private environment variables. A browser bundle cannot, so the one value the
 * client genuinely needs is exposed through a public variable instead of
 * shipping the whole object.
 */
export const JURISDICTION_CODE = process.env.NEXT_PUBLIC_JURISDICTION_CODE ?? "ROEA";
