// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  exp: number
}

const TOKEN_KEY = 'auth_token'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register']

// Protected routes that require authentication
const protectedRoutes = ['/dashboard']

// Auth routes that authenticated users shouldn't access
const authRoutes = ['/login', '/register']

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value

  const isAuthenticated = token ? isTokenValid(token) : false

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If token exists but is invalid, clear it
  if (token && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(TOKEN_KEY)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
