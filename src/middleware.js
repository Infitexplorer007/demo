import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the user is trying to access the protected admin routes (excluding the login page itself)
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token');

    // If there is no token, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware only to /admin routes
  matcher: '/admin/:path*',
};
