import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '@/lib/api'
import { setAuthToken, removeAuthToken, getAuthToken } from '@/lib/authUtils'
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  ErrorResponse,
} from '@/types/auth.types'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/login',
        JSON.stringify(credentials),
        { headers: { 'Content-Type': 'application/json' } },
      )
      const { user, token } = response.data.data
      setAuthToken(token)
      return { user, token }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Login failed',
      )
    }
  },
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/register',
        JSON.stringify(credentials),
        { headers: { 'Content-Type': 'application/json' } },
      )
      const { user, token } = response.data.data
      setAuthToken(token)
      return { user, token }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed',
      )
    }
  },
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        return rejectWithValue('No token found')
      }
      const response = await api.get<{
        success: boolean
        data: { user: User }
      }>('/auth/me')
      return { user: response.data.data.user, token }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>
      removeAuthToken()
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeAuthToken()
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          state.error = null
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          state.error = null
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        loadUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.isLoading = false
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
        },
      )
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
