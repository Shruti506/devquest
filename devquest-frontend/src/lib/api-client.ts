// src/lib/api-client.ts
import {
  getClientToken,
  getClientRefreshToken,
  isTokenValid,
  setClientToken,
  clearClientTokens,
} from "./auth"
import { refreshAccessToken } from "@/actions/auth.actions"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
  token?: string
}

interface ApiErrorResponse {
  message: string
  code?: string
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function getValidToken(): Promise<string | null> {
  let token = getClientToken()

  if (!token) return null

  if (isTokenValid(token)) return token

  if (isRefreshing) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refreshToken = getClientRefreshToken()
      if (!refreshToken) {
        clearClientTokens()
        window.location.href = "/login"
        return null
      }

      const result = await refreshAccessToken(refreshToken)

      if (result.success && result.accessToken) {
        setClientToken(result.accessToken)
        return result.accessToken
      } else {
        clearClientTokens()
        window.location.href = "/login"
        return null
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      clearClientTokens()
      window.location.href = "/login"
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { skipAuth, token: passedToken, ...fetchOptions } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (!skipAuth) {
    const token = passedToken || (await getValidToken())
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      cache: options.cache || "no-store",
    })

    if (!response.ok) {
      const error: ApiErrorResponse = await response
        .json()
        .catch(() => ({ message: "Request failed" }))

      if (error.code === "TOKEN_EXPIRED" && !skipAuth) {
        console.log("Token expired, attempting refresh...")

        // Try to get a new token
        const newToken = await getValidToken()

        if (newToken) {
          return apiFetch<T>(endpoint, {
            ...options,
            token: newToken,
          })
        }
      }

      if (
        error.message?.includes("Invalid token") ||
        error.message?.includes("Session revoked") ||
        error.message?.includes("Token has been revoked") ||
        error.code === "TOKEN_REVOKED"
      ) {
        console.log("Invalid token detected, logging out...")
        clearClientTokens()
        window.location.href = "/login"
        throw new Error("Session expired. Please login again.")
      }

      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("An unexpected error occurred")
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),
}
