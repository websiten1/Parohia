import { appendFileSync } from "node:fs";

/**
 * Transactional email. M1 has no provider, so codes are written where a
 * developer can read them, behind this interface so M2 can swap in Resend or
 * Postmark without touching a single call site.
 *
 * TODO(M2): implement ResendMailer and select on an env var.
 */
export interface Mailer {
  sendVerificationCode(to: string, code: string): Promise<void>;
  sendPasswordResetCode(to: string, code: string): Promise<void>;
}

class DevMailer implements Mailer {
  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.write(`[mail] verification code for ${to}: ${code}`);
  }

  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    await this.write(`[mail] password reset code for ${to}: ${code}`);
  }

  private async write(line: string): Promise<void> {

    // Deliberately loud: this is the only way to finish signing up in M1.
    console.info(line);

    /**
     * Node buffers stdout when it is a pipe rather than a terminal, so a low
     * volume of log lines can sit unflushed for a long time. Anything reading
     * the output programmatically, the test suite included, would block. The
     * outbox is written synchronously so it is readable the instant the send
     * returns.
     */
    const outbox = process.env.MAIL_OUTBOX;
    if (outbox) {
      try {
        appendFileSync(outbox, `${line}\n`);
      } catch (err) {
        console.warn("could not write to MAIL_OUTBOX:", err);
      }
    }
  }
}

export const mailer: Mailer = new DevMailer();
