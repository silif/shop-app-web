import { Modal } from "antd";
import { getToken, removeToken } from "./token";

export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  code: number;
}

const SUCCESS_CODE = 0;
const UNAUTHORIZED_CODE = 40100;
let isUnauthorizedModalOpen = false;

const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
  return typeof value === "object" && value !== null && "code" in value;
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

const handleUnauthorized = (message?: string) => {
  if (isUnauthorizedModalOpen) {
    return;
  }

  isUnauthorizedModalOpen = true;
  removeToken();
  Modal.warning({
    title: "登录状态已失效",
    content: message || "请重新登录后继续操作",
    okText: "去登录",
    centered: true,
    onOk: () => {
      isUnauthorizedModalOpen = false;
      redirectToLogin();
    },
    afterClose: () => {
      isUnauthorizedModalOpen = false;
      redirectToLogin();
    },
  });
};

export class HttpRequest {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = "", timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }

  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  private async request<T>(
    url: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.timeout,
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const token = getToken();
    const authHeader: Record<string, string> = {};
    if (token) {
      authHeader.Authorization = `Bearer ${token}`;
    }
    const finalHeaders = { ...this.defaultHeaders, ...authHeader, ...headers };
    const isFormDataBody = body instanceof FormData;
    if (isFormDataBody) {
      delete finalHeaders["Content-Type"];
    }

    const requestBody: BodyInit | undefined = isFormDataBody
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined;

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: finalHeaders,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type") || "";
      const isJsonResponse = contentType.includes("application/json");
      const result = isJsonResponse ? await response.json() : null;

      if (!response.ok) {
        if (isApiResponse(result) && result.code === UNAUTHORIZED_CODE) {
          handleUnauthorized(result.message);
          throw new Error(result.message || "登录状态已失效");
        }
        if (isApiResponse(result) && result.code !== SUCCESS_CODE) {
          throw new Error(result.message || "请求失败");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (result === null) {
        return undefined as T;
      }

      if (isApiResponse<T>(result)) {
        if (result.code === UNAUTHORIZED_CODE) {
          handleUnauthorized(result.message);
          throw new Error(result.message || "登录状态已失效");
        }

        if (result.code !== SUCCESS_CODE) {
          throw new Error(result.message || "请求失败");
        }

        return result.data;
      }

      return result as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "POST", body: data });
  }

  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "PUT", body: data });
  }

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "PATCH", body: data });
  }
}

export const http = new HttpRequest();

export default http;
