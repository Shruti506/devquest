// src/types/auth.ts

export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface ValidationErrors {
  email?: string
  password?: string
  name?: string
  confirmPassword?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
