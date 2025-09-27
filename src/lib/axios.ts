import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const method = (cfg.method ?? "get").toUpperCase();
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const token = getCookie("csrftoken");
    if (token) {
      // Ensure we have an AxiosHeaders instance
      const headers =
        cfg.headers instanceof AxiosHeaders
          ? cfg.headers
          : new AxiosHeaders(cfg.headers);

      headers.set("X-CSRFToken", token);
      cfg.headers = headers;
    }
  }
  return cfg;
});