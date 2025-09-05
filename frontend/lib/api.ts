import axios from "axios";
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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined") {
      console.error("API error:", err?.response?.status, err?.response?.data || err?.message);
    }
    return Promise.reject(err);
  }
);