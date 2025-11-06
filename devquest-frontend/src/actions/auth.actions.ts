// src/actions/auth.actions.ts
'use server'

import { redirect } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { setServerToken, clearServerToken, getServerToken } from '@/lib/auth'
import {
  LoginFormData,
  RegisterFormData,
  loginSchema,
  registerSchema,
} from '@/lib/validations'
import { AuthResponse, ApiError } from '@/types/auth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface ActionResult {
  success: boolean
  message?: string
  errors?: Record<string, string>
}

export async function loginAction(
  formData: LoginFormData,
): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = loginSchema.parse(formData)

    // Call API
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      validatedData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    await setServerToken(response.data.token)

    return { success: true, message: 'Login successful' }
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

    // Store token in httpOnly cookie
    await setServerToken(response.data.token)

    return { success: true, message: 'Registration successful' }
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
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

export async function logoutAction(): Promise<void> {
  try {
    const token = await getServerToken()

    if (!token) {
      console.warn('No token found during logout')
    }

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
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    await clearServerToken()
    redirect('/login')
  }
}
