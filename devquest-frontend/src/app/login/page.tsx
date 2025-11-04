import { redirect } from 'next/navigation'
import { Card, CardHeader, CardContent, Typography } from '@mui/material'
import LoginForm from '@/components/forms/LoginForm'
import { isServerAuthenticated } from '@/lib/auth'

export const metadata = {
  title: 'Login - Your App',
  description: 'Sign in to your account',
}

export default async function LoginPage() {
  const authenticated = await isServerAuthenticated()
  if (authenticated) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold">
              Welcome Back
            </Typography>
          }
          subheader={
            <Typography variant="body2" align="center">
              Sign in to your account to continue
            </Typography>
          }
        />
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
