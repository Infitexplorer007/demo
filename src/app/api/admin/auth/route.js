import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, getTokenFromRequest } from '@/lib/auth';

// POST /api/admin/auth — login
export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    // Compare submitted password against the hashed env variable
    // For simplicity, we compare plaintext here. In production hash it.
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isValid = password === adminPassword;

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }

    const token = signToken({ role: 'admin' });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    // Store token in an httpOnly cookie — JS cannot access this
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/admin/auth — logout (clears cookie)
export async function GET(request) {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
