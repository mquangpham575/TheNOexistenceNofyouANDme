export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  profile: Profile | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
