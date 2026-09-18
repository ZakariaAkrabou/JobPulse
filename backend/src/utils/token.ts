import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import env from "../config/env"


type AccessTokenPayload = {
    sub:string,
    role: "client" | "admin";
}

export function generateVerificationToken(): string {

    return crypto.randomBytes(32).toString('hex');
}

export function verificationTokenExpiry(hoursFromNow: number = 24): Date {
    return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
}

export function signAccessToken(payload: AccessTokenPayload): string {

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {

    expiresIn: env.JWT_ACCESS_EXPIRES_IN,

  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {

  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

}

export function generateRefreshToken(): string {

  return crypto.randomBytes(48).toString("hex");

}

export function refreshTokenExpiry(daysFromNow = 7): Date {

  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);


}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function resetTokenExpiry(minutesFromNow = 60): Date {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
}