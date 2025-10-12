import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}


api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const method = (cfg.method ?? "get").toLowerCase();

  if (!["get", "head", "options"].includes(method)) {
    const token = getCookie("csrftoken");
    if (token) {
      const headers =
        cfg.headers instanceof AxiosHeaders
          ? cfg.headers
          : new AxiosHeaders(cfg.headers);

      // Django expects 'X-CSRFToken' header
      headers.set("X-CSRFToken", token);
      cfg.headers = headers;
    }
  }

  return cfg;
});


export async function initCsrf() {
  try {
    await api.get("/csrf/");
  } catch (err) {
    console.error("Failed to initialize CSRF:", err);
  }
}
