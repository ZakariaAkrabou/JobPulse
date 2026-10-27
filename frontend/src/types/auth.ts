export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterFieldError = {
  field: string;
  message: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  errors?: RegisterFieldError[];
};