import { create } from "zustand";

const STORAGE_KEY = "abel_admin_auth";

function readPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: "", user: null };
    const parsed = JSON.parse(raw);
    return { token: parsed.token || "", user: parsed.user || null };
  } catch (_error) {
    return { token: "", user: null };
  }
}

const persisted = readPersistedAuth();

const useAuthStore = create((set) => ({
  token: persisted.token,
  user: persisted.user,
  setAuth: ({ token, user }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user });
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: "", user: null });
  },
}));

export { useAuthStore };
