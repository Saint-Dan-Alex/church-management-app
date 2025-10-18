import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth-user")
  const { pathname } = request.nextUrl

  // Protected dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authCookie) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const user = JSON.parse(authCookie.value)
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
