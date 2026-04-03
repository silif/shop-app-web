export interface LoginParams {
  account: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

export interface RegisterParams {
  email: string;
  code: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  id: number;
  username: string;
  email: string;
}

export interface SendVerificationCodeParams {
  email: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  email: string;
  verificationCode: string;
  newPassword: string;
}
