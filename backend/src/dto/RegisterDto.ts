export type CreateUserInput = {
  email: string;
  passwordHash: string;
  fullName: string;
  verificationToken: string;
  verificationTokenExpiresAt: Date;
};