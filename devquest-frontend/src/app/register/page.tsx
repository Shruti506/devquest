import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import RegisterForm from '@/components/forms/RegisterForm'
import { isServerAuthenticated } from '@/lib/auth'

export const metadata = {
  title: 'Register - Your App',
  description: 'Create a new account',
}

export default async function RegisterPage() {
  const authenticated = await isServerAuthenticated()
  if (authenticated) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight="bold">
              Create Account
            </Typography>
          }
          subheader={
            <Typography variant="body2" align="center">
              Sign up to get started
            </Typography>
          }
        />
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
