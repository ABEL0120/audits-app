import axios from "axios";

type ViteEnv = { VITE_API_BASE?: string };
const apiBase =
  (import.meta as unknown as { env: ViteEnv }).env?.VITE_API_BASE || "";

export const api = axios.create({
  baseURL: apiBase,
  headers: { Accept: "application/json" },
});

export async function loginApi(email: string, password: string) {
  const resp = await api.post("/api/v1/auth/login", { email, password });
  return resp.data;
}

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;
