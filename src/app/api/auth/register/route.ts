import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { conflict, readJson, route } from "@/lib/api/errors";
import { hashPassword } from "@/lib/auth/password";
import { issueEmailVerification } from "@/lib/auth/verification";
import { registerSchema } from "@/lib/validation/schemas";

/**
 * Creates an account and emails a code. No session is returned: the hard gate
 * means a session only exists once the address is confirmed.
 */
export const POST = route(async (req: Request) => {
  const input = registerSchema.parse(await readJson(req));
  const passwordHash = await hashPassword(input.password);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
        phone: input.phone ?? null,
        preferredLanguage: input.preferredLanguage,
      },
      select: { id: true, email: true },
    });
  } catch (err) {
    // P2002 is the unique violation on email. Registration is the one place
    // where revealing that an address is taken is unavoidable, since the person
    // has to be told to sign in instead.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw conflict("email_taken", "An account already uses that email address.");
    }
    throw err;
  }

  await issueEmailVerification(user.id, user.email);

  return NextResponse.json(
    { ok: true, nextStep: "verify_email", email: user.email },
    { status: 201 },
  );
});
