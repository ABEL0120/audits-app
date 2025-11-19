import { create } from 'zustand'
type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// read initial auth from localStorage so reloads persist session
const LS_TOKEN_KEY = "audits:token";
const LS_USER_KEY = "audits:user";

function readInitial() {
  try {
    const token = localStorage.getItem(LS_TOKEN_KEY);
    const userRaw = localStorage.getItem(LS_USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user } as { token: string | null; user: User | null };
  } catch (err) {
    console.debug("auth: readInitial localStorage error", err);
    return { token: null, user: null };
  }
}

const initial = readInitial();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial.token,
  user: initial.user,
  setToken: (token) => {
    try {
      if (token) localStorage.setItem(LS_TOKEN_KEY, token);
      else localStorage.removeItem(LS_TOKEN_KEY);
    } catch (err) {
      console.debug("auth: setToken localStorage error", err);
    }
    set({ token });
  },
  setUser: (user) => {
    try {
      if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(LS_USER_KEY);
    } catch (err) {
      console.debug("auth: setUser localStorage error", err);
    }
    set({ user });
  },
  login: (token, user) => {
    try {
      localStorage.setItem(LS_TOKEN_KEY, token);
      localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.debug("auth: login localStorage error", err);
    }
    set({ token, user });
  },
  logout: () => {
    try {
      localStorage.removeItem(LS_TOKEN_KEY);
      localStorage.removeItem(LS_USER_KEY);
    } catch (err) {
      console.debug("auth: logout localStorage error", err);
    }
    // Best-effort: clear API runtime cache so next user/session doesn't see previous data
    try {
      if (typeof caches !== "undefined") {
        // fire-and-forget; don't block UI logout
        caches.delete("api-cache").catch((e) => console.debug("auth: cache delete error", e));
      }
    } catch (err) {
      console.debug("auth: cache delete error", err);
    }
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
