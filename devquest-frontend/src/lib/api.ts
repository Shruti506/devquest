// src/lib/api.ts
import axios, { AxiosError, AxiosInstance } from 'axios'
import { getToken, clearToken } from './auth'
import { ApiError } from '@/types/auth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      clearToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Format error message
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred'

    return Promise.reject({
      message: errorMessage,
      statusCode: error.response?.status,
      errors: error.response?.data?.errors,
    } as ApiError)
  },
)

export default apiClient

// API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    apiClient.post('/auth/register', { name, email, password }),

  logout: () => apiClient.post('/auth/logout'),

  verifyToken: () => apiClient.get('/auth/verify'),
}
