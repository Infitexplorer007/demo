import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable in .env.local');
}

// Creates a signed JWT token for the admin
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verifies and decodes a JWT token — returns null if invalid or expired
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Reads the token from cookies and verifies it — use in API route guards
export function getTokenFromRequest(request) {
  const cookie = request.cookies.get('admin_token');
  if (!cookie?.value) return null;
  return verifyToken(cookie.value);
}
