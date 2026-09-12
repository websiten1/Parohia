import { NextResponse } from "next/server";
import { route } from "@/lib/api/errors";
import { jurisdiction } from "@/lib/jurisdiction";

/**
 * The deployment's own identity. Unauthenticated on purpose: a sign-in screen
 * has to know whose diocese it belongs to before anyone has signed in, and
 * none of this is secret.
 */
export const GET = route(async () => {
  const j = jurisdiction();
  return NextResponse.json({
    jurisdiction: {
      code: j.code,
      name: j.name,
      brand: j.brand,
      hierarchName: j.hierarchName,
      hierarchTitle: j.hierarchTitle,
      websiteUrl: j.websiteUrl ?? null,
    },
  });
});
