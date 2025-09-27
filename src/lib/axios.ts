import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,

  // CSRF handling for Django
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});