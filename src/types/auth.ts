export interface LoginFormData {
  account: string;
  email: string;
  verificationCode: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormData {
  email: string;
  verificationCode: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export type AuthMode = 'login' | 'register';

export interface CountdownTimerOptions {
  onTick?: (remaining: number) => void;
  onComplete?: () => void;
}