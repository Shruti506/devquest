'use client'

import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { useUser } from '@/context/UserProvider'

export default function DashboardContent() {
  const { userData } = useUser()

  return (
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
              Logged in as: <strong>{userData?.user?.name || 'User'}</strong>
            </p>
            <p className="text-gray-700">
              XP: <strong>{userData?.user?.xp?.toLocaleString() || 0}</strong>
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
    </div>
  )
}
