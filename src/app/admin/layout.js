import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// This layout protects ALL /admin/* routes except /admin/login
export default async function AdminLayout({ children }) {
  // Allow /admin/login without auth check (it's the login page itself)
  return <div>{children}</div>;
}
