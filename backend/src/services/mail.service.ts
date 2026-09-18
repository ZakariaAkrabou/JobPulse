import {mailer} from "../config/mail";
import env from "../config/env";
import type {VerificationMailInput,ResetPasswordMailInput} from "../dto/MailDto";

export async function sendVerificationMail(input:VerificationMailInput): Promise<void> {
    
    const VerifyUrl = `${env.APP_URL}/api/auth/verify?token=${input.token}`;

    if(!env.EMAIL_USER || !env.EMAIL_PASS) {
        console.log("Mailer disabled. Verification URL:", VerifyUrl);
        return;
    }

    await mailer.sendMail({
        from: `"JobPulse" <${env.EMAIL_USER}>`,
        to : input.to,
        subject: "Verify your JobPulse account",
        text: `Hi ${input.fullName},\n\nVerify your email by clicking: ${VerifyUrl}\n\nThis link expires in 24 hours.`,
        html: `
                <p>Hi ${input.fullName},</p>
                <p>Verify your email by clicking the link below:</p>
                <p><a href="${VerifyUrl}">Verify my email</a></p>
                <p>This link expires in 24 hours.</p>
                <p>— JobPulse</p>
            `,
    })
}

export async function sendResetPasswordMail(input: ResetPasswordMailInput) {
  const resetUrl = `${env.APP_URL}/reset-password?token=${input.token}`;

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.log("  Mailer disabled. Reset URL:", resetUrl);
    return;
  }

  await mailer.sendMail({
    from: `"JobPulse" <${env.EMAIL_USER}>`,
    to: input.to,
    subject: "Reset your JobPulse password",
    text: `Hi ${input.fullName},\n\nReset your password by clicking: ${resetUrl}\n\nThis link expires in 60 minutes. If you didn't request this, ignore this email.`,
    html: `
      <p>Hi ${input.fullName},</p>
      <p>Reset your password by clicking the link below:</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>This link expires in 60 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
      <p>— JobPulse</p>
    `,
  });
}