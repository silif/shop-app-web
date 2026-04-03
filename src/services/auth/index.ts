import http from "@/utils/request";
import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
  SendVerificationCodeParams,
  ForgotPasswordParams,
  ResetPasswordParams,
} from "./dto";

const BASE_URL = "/api/auth";

export const authService = {
  login: (params: LoginParams) => {
    return http.post<LoginResponse>(`${BASE_URL}/login`, params);
  },

  register: (params: RegisterParams) => {
    return http.post<RegisterResponse>(`${BASE_URL}/register`, params);
  },

  sendVerificationCode: (params: SendVerificationCodeParams) => {
    return http.post(`${BASE_URL}/register/code`, params);
  },

  findPassword: (params: ForgotPasswordParams) => {
    return http.post(`${BASE_URL}/password/forgot`, params);
  },

  resetPassword: (params: ResetPasswordParams) => {
    return http.post(`${BASE_URL}/password/reset`, params);
  },
};

export default authService;
