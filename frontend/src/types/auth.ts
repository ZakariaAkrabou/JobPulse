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
export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
};