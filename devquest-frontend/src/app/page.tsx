import { redirect } from 'next/navigation'
import { isServerAuthenticated } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FeatureCards from '@/components/FeatureCards'

export default async function HomePage() {
  const authenticated = await isServerAuthenticated()

  if (authenticated) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Secure Auth
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A production-ready authentication system built with Next.js,
            TypeScript, and Material-UI
          </p>

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
                className="w-full sm:w-auto px-8 bg-red-500"
              >
                Create Account
              </Button>
            </Link>
          </div>

          <FeatureCards />
        </div>
      </div>
    </div>
  )
}
