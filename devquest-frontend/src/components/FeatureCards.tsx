// src/components/FeatureCards.tsx
'use client'

import { Card, CardContent } from '@mui/material'

export default function FeatureCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-600 text-sm">
            JWT-based authentication with secure token storage and validation
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Protected Routes</h3>
          <p className="text-gray-600 text-sm">
            Middleware-based route protection with automatic redirects
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Form Validation</h3>
          <p className="text-gray-600 text-sm">
            Strong password validation and real-time form error handling
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
