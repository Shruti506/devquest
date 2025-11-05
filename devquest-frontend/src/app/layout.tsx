// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'
import { getServerToken, decodeToken } from '@/lib/auth'
import Navbar from '@/components/Navbar'

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

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="min-h-screen">
            <Navbar userEmail={userEmail} token={token} />

            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
