// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { getServerToken, decodeToken } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - Your App',
  description: 'Your dashboard',
}

export default async function DashboardPage() {
  const token = await getServerToken()

  if (!token) {
    redirect('/login')
  }

  const decoded = decodeToken(token)
  const userEmail = decoded?.email || 'User'

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md">
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Welcome to Your Dashboard
              </Typography>
            }
          />
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                You are logged in as: <strong>{userEmail}</strong>
              </p>
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium">
                  ✓ Authentication successful
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Your session is secure and active.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md mt-6">
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Quick Stats
              </Typography>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-purple-600">56</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
