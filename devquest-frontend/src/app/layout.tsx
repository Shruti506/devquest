// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import { getServerToken, decodeToken } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auth App - Secure Login & Registration',
  description: 'Secure authentication system built with Next.js and MUI',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getServerToken()
  const decoded = token ? decodeToken(token) : null
  const userEmail = decoded?.sub || null
  const showNavbar = !!userEmail

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="min-h-screen">
            {showNavbar && (
              <div className="bg-gray-50 shadow p-8">
                <div className="max-w-8xl mx-auto flex justify-between items-center">
                  <Link
                    href="/dashboard"
                    className="text-2xl font-bold text-gray-900"
                  >
                    Dashboard
                  </Link>

                  <nav className="flex space-x-6">
                    <Link
                      href="/quest"
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Quest
                    </Link>
                    <Link
                      href="/my-quest"
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      My Quest
                    </Link>
                    <Link
                      href="/leaderboard"
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Leaderboard
                    </Link>
                  </nav>

                  <LogoutButton />
                </div>
              </div>
            )}

            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
