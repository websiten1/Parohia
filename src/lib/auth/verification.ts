import { TokenPurpose } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mailer } from "@/lib/mail/mailer";
import { generateVerificationCode, hashToken, VERIFICATION_TTL_MINUTES } from "./tokens";

/**
 * Issues a fresh code and invalidates any earlier unused one, so a resend
 * cannot leave two working codes in circulation.
 */
export async function issueEmailVerification(userId: string, email: string): Promise<void> {
  const code = generateVerificationCode();

  await prisma.$transaction([
    prisma.verificationToken.updateMany({
      where: { userId, purpose: TokenPurpose.EMAIL_VERIFICATION, consumedAt: null },
      data: { consumedAt: new Date() },
    }),
    prisma.verificationToken.create({
      data: {
        userId,
        purpose: TokenPurpose.EMAIL_VERIFICATION,
        codeHash: hashToken(code),
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MINUTES * 60_000),
      },
    }),
  ]);

  await mailer.sendVerificationCode(email, code);
}
