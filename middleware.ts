import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous'
    const limit = 100 // requests per minute
    const windowMs = 60 * 1000 // 1 minute

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      })
    }

    const rateLimitInfo = rateLimitMap.get(ip)

    if (Date.now() - rateLimitInfo.lastReset > windowMs) {
      rateLimitInfo.count = 0
      rateLimitInfo.lastReset = Date.now()
    }

    if (rateLimitInfo.count >= limit) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    rateLimitInfo.count += 1
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
