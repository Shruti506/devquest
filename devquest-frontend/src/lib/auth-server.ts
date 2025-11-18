// src/lib/auth-server.ts
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

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

export const getServerToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_KEY)?.value || null
}

export const getServerRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value || null
}

export const setServerToken = async (token: string): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, 
    path: '/',
  })
}

export const setServerRefreshToken = async (token: string): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_TOKEN_KEY, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  })
}

export const clearServerToken = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_KEY)
  cookieStore.delete(REFRESH_TOKEN_KEY)
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

export const isServerAuthenticated = async (): Promise<boolean> => {
  const token = await getServerToken()
  if (!token) return false
  return isTokenValid(token)
}
