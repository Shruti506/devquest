import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

interface JWTPayload {
  exp: number
  iat: number
  userId?: string
  sub?: string
  email?: string
  type?: string
}

export const getClientToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return Cookies.get(TOKEN_KEY) || null
}

export const getClientRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return Cookies.get(REFRESH_TOKEN_KEY) || null
}

export const setClientToken = (token: string): void => {
  if (typeof window === 'undefined') return
  Cookies.set(TOKEN_KEY, token, {
    expires: 1 / 96,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export const setClientRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export const clearClientTokens = (): void => {
  if (typeof window === 'undefined') return
  Cookies.remove(TOKEN_KEY, { path: '/' })
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' })
}

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime + 30
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

export const isClientAuthenticated = (): boolean => {
  const token = getClientToken()
  if (!token) return false
  return isTokenValid(token)
}
