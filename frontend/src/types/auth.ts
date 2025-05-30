// src/types/auth.ts

export type UserRole = 'Manager' | 'Worker';

export interface LoginResponse {
  status: 'success' | 'error';
  message: string;
  token: string | null;
  role: UserRole | null;
  redirect_url: string | null;
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

