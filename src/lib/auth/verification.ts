import { TokenPurpose } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mailer } from "@/lib/mail/mailer";
import { generateVerificationCode, hashToken, VERIFICATION_TTL_MINUTES } from "./tokens";

/**
 * Issues a fresh code and invalidates any earlier unused one of the same
 * purpose, so a resend cannot leave two working codes in circulation.
 */
async function issueCode(userId: string, purpose: TokenPurpose): Promise<string> {
  const code = generateVerificationCode();

  await prisma.$transaction([
    prisma.verificationToken.updateMany({
      where: { userId, purpose, consumedAt: null },
      data: { consumedAt: new Date() },
    }),
    prisma.verificationToken.create({
      data: {
        userId,
        purpose,
        codeHash: hashToken(code),
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MINUTES * 60_000),
      },
    }),
  ]);

  return code;
}

export async function issueEmailVerification(userId: string, email: string): Promise<void> {
  const code = await issueCode(userId, TokenPurpose.EMAIL_VERIFICATION);
  await mailer.sendVerificationCode(email, code);
}

export async function issuePasswordReset(userId: string, email: string): Promise<void> {
  const code = await issueCode(userId, TokenPurpose.PASSWORD_RESET);
  await mailer.sendPasswordResetCode(email, code);
}
