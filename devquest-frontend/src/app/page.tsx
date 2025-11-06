import { redirect } from 'next/navigation'
import { isServerAuthenticated } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const authenticated = await isServerAuthenticated()

  if (authenticated) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Dev Quest
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 border-gray-800 text-gray-800 hover:bg-gray-100"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
