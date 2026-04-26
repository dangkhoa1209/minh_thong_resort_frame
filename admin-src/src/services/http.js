import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 120000,
});

http.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("abel_admin_auth");
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  } catch (_error) {
    // noop
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("abel_admin_auth");
    }
    return Promise.reject(error);
  }
);

export { http };
