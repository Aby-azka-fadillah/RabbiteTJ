import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const secureCookie = process.env.NODE_ENV === 'production'

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
    secureCookie,
  })

  const isAuthenticated = !!token
  const role = (token as any)?.role

  // Proteksi /admin — hanya admin
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Proteksi /dashboard — hanya user biasa
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated || role !== 'user') {
      return NextResponse.redirect(new URL('/masuk', req.url))
    }
  }

  // Jika sudah login sebagai user, redirect /masuk dan /daftar ke dashboard user
  if ((pathname === '/masuk' || pathname === '/daftar') && isAuthenticated && role === 'user') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Jika sudah login sebagai admin, redirect /login ke admin dashboard
  if (pathname === '/login' && isAuthenticated && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/masuk', '/daftar', '/login'],
}
