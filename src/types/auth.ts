// src/types/auth.ts

export type UserRole = 'Manager' | 'Worker';

// Login response
export interface LoginResponse {
  status: 'success' | 'error';
  message: string;
  token: string | null;
  role: UserRole | null;
  redirect_url: string | null;
}

// API 
export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

// User Info
export interface User {
  id: number;
  username: string;
  role: UserRole;
}

