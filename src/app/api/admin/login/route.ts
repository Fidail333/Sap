import { NextResponse } from 'next/server';
import { setAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const data = await request.formData();
  const password = String(data.get('password') || '');

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url));
  }

  setAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin', request.url));
}
