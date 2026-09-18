import type { Request, Response } from "express";
import {registerSchema,loginSchema,verifyEmailSchema,} from "../validators/auth.validator.js";
import { createClientUser,findUserByEmail,findUserByVerificationToken,markUserVerified,setRefreshToken,getRoleNameById,
         setResetPasswordToken, findUserByResetToken, updateUserPassword,} from "../services/auth.service.js";
import { sendResetPasswordMail, sendVerificationMail } from "../services/mail.service.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { generateVerificationToken,verificationTokenExpiry,signAccessToken, generateRefreshToken, refreshTokenExpiry,generateResetToken,resetTokenExpiry,} from "../utils/token";
import env from "../config/env.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";



export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.issues.map((issue) => ({ field: issue.path.join("."),
            message: issue.message 
        })),
     });
    }
    const { email, password, fullName } = parsed.data;

    const existingUser = await findUserByEmail(email);
    if(existingUser) {
        return res.status(409).json({
            success:false,
            message: "Email is already exists",
        });
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = verificationTokenExpiry();

    const newUser = await createClientUser({
        email,
        passwordHash,
        fullName,
        verificationToken,
        verificationTokenExpiresAt,
    });

    try{
        await sendVerificationMail({
            to: newUser.email,
            fullName: newUser.fullName,
            token: verificationToken,
        });
    }
    catch(error) {
        console.error("Error sending verification email:", error);
    }

    return res.status(201).json({
        success: true,
        message: "User registered successfully. Please check your email to verify your account.",
    });

}


export async function login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    
    if(!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if(!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if(!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    if(!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Please verify your email before logging in",
        });
    }

   const roleName = await getRoleNameById(user.roleId);
if (!roleName) {
  return res.status(500).json({
    success: false,
    message: "User role not found",
  });
}

const accessToken = signAccessToken({
  sub: user.id.toString(),
  role: roleName,
});

    const refreshToken = generateRefreshToken();
    const refreshTokenExpiresAt = refreshTokenExpiry();
    await setRefreshToken(user.id, refreshToken, refreshTokenExpiresAt);
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
    res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth", 
  });
   return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
    },
  });
}

export async function verifyEmail(req: Request, res: Response) {
  const parsed = verifyEmailSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { token } = parsed.data;

  const user = await findUserByVerificationToken(token);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification link",
    });
  }

  if (
    !user.verificationTokenExpiresAt ||
    user.verificationTokenExpiresAt < new Date()
  ) {
    return res.status(400).json({
      success: false,
      message: "Verification link has expired. Please request a new one.",
    });
  }

  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      message: "Email already verified",
    });
  }

  await markUserVerified(user.id);

  return res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { email } = parsed.data;

  const user = await findUserByEmail(email);

  if (user) {
    const resetToken = generateResetToken();
    const resetTokenExpiresAt = resetTokenExpiry(env.RESET_TOKEN_EXPIRES_MINUTES);

    await setResetPasswordToken(user.id, resetToken, resetTokenExpiresAt);

    try {
      await sendResetPasswordMail({
        to: user.email,
        fullName: user.fullName,
        token: resetToken,
      });
    } catch (err) {
      console.error("Failed to send reset-password email:", err);
    }
  }

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with that email, you will receive a password reset link shortly.",
  });
}

export async function resetPassword(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { token, newPassword } = parsed.data;

  const user = await findUserByResetToken(token);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset link",
    });
  }

  if (
    !user.resetPasswordTokenExpiresAt ||
    user.resetPasswordTokenExpiresAt < new Date()
  ) {
    return res.status(400).json({
      success: false,
      message: "Reset link has expired. Please request a new one.",
    });
  }

  const newPasswordHash = await hashPassword(newPassword);

  await updateUserPassword(user.id, newPasswordHash);

  return res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in with your new password.",
  });
}
