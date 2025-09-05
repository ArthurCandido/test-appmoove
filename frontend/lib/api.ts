import axios from "axios";

// Base URL configurável via NEXT_PUBLIC_API_URL (client-side)
// Fallback: detect host from browser to evitar erro entre localhost/127.0.0.1
const resolvedBaseURL = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:4000`;
  }
  return "http://localhost:4000";
})();

export const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Pequeno interceptor de erro para facilitar debug no cliente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("API error:", err?.response?.status, err?.response?.data || err?.message);
    }
    return Promise.reject(err);
  }
);