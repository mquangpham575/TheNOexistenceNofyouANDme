import type { AuthResponse, Profile, User } from "#types/auth";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string, displayName: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/auth/me"),

  getProfile: () => request<Profile>("/profile"),

  updateProfile: (data: {
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string | null;
  }) =>
    request<Profile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
