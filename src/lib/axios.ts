import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

let csrfToken: string | null = null;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const method = (cfg.method ?? "get").toLowerCase();
  if (!["get", "head", "options"].includes(method) && csrfToken) {
    // Ensure headers is an AxiosHeaders instance
    const headers =
      cfg.headers instanceof AxiosHeaders
        ? cfg.headers
        : new AxiosHeaders(cfg.headers);

    headers.set("X-CSRFToken", csrfToken);
    cfg.headers = headers;
  }
  return cfg;
});

// Initialize CSRF once per app load
export async function initCsrf() {
  try {
    const res = await api.get("/csrf/");
    csrfToken = res.data.csrfToken;
    // console.log("CSRF token initialized:", csrfToken);
  } catch (err) {
    console.error("Failed to initialize CSRF:", err);
  }
}
