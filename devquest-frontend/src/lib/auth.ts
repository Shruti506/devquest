// src/lib/auth.ts
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'auth_token'

interface JWTPayload {
  exp: number
  iat: number
  userId?: string
  sub?: string
  email?: string
}

// Client-side token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// Server-side token management (for middleware and server components)
export const getServerToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_KEY)?.value || null
}

export const setServerToken = async (token: string): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export const clearServerToken = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_KEY)
}

// Token validation
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token)
  } catch {
    return null
  }
}

// Check authentication status
export const isAuthenticated = (): boolean => {
  const token = getToken()
  if (!token) return false
  return isTokenValid(token)
}

export const isServerAuthenticated = async (): Promise<boolean> => {
  const token = await getServerToken()
  if (!token) return false
  return isTokenValid(token)
}
