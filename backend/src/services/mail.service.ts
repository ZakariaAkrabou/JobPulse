import { mailer } from "../config/mail";
import env from "../config/env";
import type { VerificationMailInput, ResetPasswordMailInput, } from "../dto/MailDto";

export async function sendVerificationMail(input: VerificationMailInput,): Promise<void> {

  const verifyUrl = new URL("/verify-email", env.FRONTEND_URL);

  verifyUrl.searchParams.set("token", input.token);

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.log("[MAIL] Mailer disabled. Verification URL:", verifyUrl.toString());
    return;
  }

  await mailer.sendMail({
    
    from: `"JobPulse" <${env.EMAIL_USER}>`,
    to: input.to,
    subject: "Verify your JobPulse account",
    text: `Hi ${input.fullName},

    Verify your email by clicking: ${verifyUrl.toString()}

    This link expires in 24 hours.`,

    html: `
          <p>Hi ${input.fullName},</p>
          <p>Verify your email by clicking the link below:</p>
          <p><a href="${verifyUrl.toString()}">Verify my email</a></p>
          <p>This link expires in 24 hours.</p>
          <p>— JobPulse</p>
        `,
        
      
  });
  
}

export async function sendResetPasswordMail(input: ResetPasswordMailInput,): Promise<void> {

  const resetUrl = new URL("/reset-password", env.FRONTEND_URL);

  resetUrl.searchParams.set("token", input.token);

  // console.log("[MAIL] RESET URL =", resetUrl.toString());   
  // console.log("[MAIL] sending to =", input.to);   

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    console.log("[MAIL] Mailer disabled. Reset URL:", resetUrl.toString());
    return;
  }

  await mailer.sendMail({
    from: `"JobPulse" <${env.EMAIL_USER}>`,
    to: input.to,
    subject: "Reset your JobPulse password",
    text: `Hi ${input.fullName},

    Reset your password by clicking: ${resetUrl.toString()}

    This link expires in 60 minutes. If you didn't request this, ignore this email.`,

    html: `
          <p>Hi ${input.fullName},</p>
          <p>Reset your password by clicking the link below:</p>
          <p><a href="${resetUrl.toString()}">Reset my password</a></p>
          <p>This link expires in 60 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
          <p>— JobPulse</p>
        `,
  });
}
