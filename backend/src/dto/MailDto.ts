export type VerificationMailInput = {
  to: string;
  fullName: string;
  token: string;
};

export type ResetPasswordMailInput = {
  to: string;
  fullName: string;
  token: string;
};