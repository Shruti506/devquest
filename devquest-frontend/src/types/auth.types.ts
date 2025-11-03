export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  // confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message?: string
}
export interface ErrorResponse {
  message?: string
  error?: string
}
