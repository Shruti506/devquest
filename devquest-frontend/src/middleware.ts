// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  exp: number
  type?: string
}

const TOKEN_KEY = "auth_token"
const REFRESH_TOKEN_KEY = "refresh_token"

const authRoutes = ["/login", "/register"]

const protectedRoutes = ["/dashboard"]

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000

    if (decoded.type !== "access") return false

    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value

  const isAuthenticated = token ? isTokenValid(token) : false
  const hasRefreshToken = !!refreshToken

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)

    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(TOKEN_KEY)
    response.cookies.delete(REFRESH_TOKEN_KEY)
    return response
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
