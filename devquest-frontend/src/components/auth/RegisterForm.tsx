'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser, clearError } from '@/store/slices/authSlice'

export default function RegisterForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // confirmPassword: '',
  })

  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) {
      dispatch(clearError())
    }
    if (validationError) {
      setValidationError('')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords match
    // if (formData.password !== formData.confirmPassword) {
    //   setValidationError('Passwords do not match')
    //   return
    // }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }

    try {
      await dispatch(registerUser(formData)).unwrap()
      router.push('/dashboard')
    } catch (err) {
      // Error is handled by Redux
    }
  }

  const displayError = validationError || error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join DevQuest today</p>
        </div>

        {displayError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{displayError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Minimum 6 characters"
            />
          </div>

          {/* <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Re-enter your password"
            />
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
