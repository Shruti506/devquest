// src/actions/auth.actions.ts
'use server'

import { redirect } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import {
  setServerToken,
  setServerRefreshToken,
  clearServerToken,
  getServerToken,
} from '@/lib/auth-server'
import {
  LoginFormData,
  RegisterFormData,
  loginSchema,
  registerSchema,
} from '@/lib/validations'
import { AuthResponse, ApiError } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function postWithRetries<T = any>(
  url: string,
  data: any,
  retries = 2,
  timeout = 5000,
): Promise<import('axios').AxiosResponse<T>> {
  let attempt = 0
  const axiosConfig = { headers: { 'Content-Type': 'application/json' }, timeout }

  while (attempt <= retries) {
    try {
      return await axios.post<T>(url, data, axiosConfig)
    } catch (err) {
      // Retry on server errors (5xx)
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status && status >= 500 && status < 600 && attempt < retries) {
          attempt += 1
          // exponential backoff
          await new Promise((res) => setTimeout(res, 300 * attempt))
          continue
        }
      }
      throw err
    }
  }
  // Shouldn't reach here, but throw to satisfy types
  throw new Error('Request failed after retries')
}

interface ActionResult {
  success: boolean
  message?: string
  errors?: Record<string, string>
  accessToken?: string
  refreshToken?: string
}

export async function loginAction(
  formData: LoginFormData,
): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)

    // Call API (with retries for transient server errors)
    const response = await postWithRetries<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      validatedData,
    )
    console.log("🚀 ~ loginAction ~ response:", response)

    // Store both tokens in httpOnly cookies
    await setServerToken(response.data.accessToken)
    await setServerRefreshToken(response.data.refreshToken)

    return {
      success: true,
      message: 'Login successful',
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
  } catch (error) {
    console.log("🚀 ~ loginAction ~ error:", error)
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as {
        issues: Array<{ path: string[]; message: string }>
      }
      const errors: Record<string, string> = {}
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      return { success: false, errors }
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed',
      }
    }

    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function registerAction(
  formData: RegisterFormData,
): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = registerSchema.parse(formData)

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = validatedData

    // Call API
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      registerData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    // Store both tokens in httpOnly cookies
    await setServerToken(response.data.accessToken)
    await setServerRefreshToken(response.data.refreshToken)

    return {
      success: true,
      message: 'Registration successful',
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as {
        issues: Array<{ path: string[]; message: string }>
      }
      const errors: Record<string, string> = {}
      zodError.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      return { success: false, errors }
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Registration failed',
      }
    }

    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<ActionResult> {
  try {
    const response = await axios.post<{ accessToken: string }>(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    // Store new access token
    await setServerToken(response.data.accessToken)

    return {
      success: true,
      accessToken: response.data.accessToken,
    }
  } catch (error) {
    console.error('Token refresh error:', error)

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>
      const errorMessage =
        axiosError.response?.data?.message || 'Token refresh failed'

      // If refresh token is invalid or expired, clear all tokens
      if (axiosError.response?.status === 401) {
        await clearServerToken()
      }

      return {
        success: false,
        message: errorMessage,
      }
    }
    await clearServerToken()

    return { success: false, message: 'Token refresh failed' }
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const token = await getServerToken()

    if (token) {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
    }
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    await clearServerToken()
    redirect('/login')
  }
}

export async function clearAllTokens(): Promise<void> {
  await clearServerToken()
}
