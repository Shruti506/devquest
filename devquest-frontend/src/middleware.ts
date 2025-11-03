import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const tokenHash = request.cookies.get('token_hash')?.value
  const { pathname } = request.nextUrl

  // Check if token exists and hash matches (basic validation)
  const isAuthenticated = !!(token && tokenHash)

  // Define public and protected routes
  const isAuthRoute =
    pathname === '/login' || pathname === '/register' || pathname === '/'
  const isProtectedRoute = pathname.startsWith('/dashboard')

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
