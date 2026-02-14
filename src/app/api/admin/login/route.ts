export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { setAdminSessionCookie, verifyAdminToken } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get('token') || formData.get('password') || '').trim();

  if (!verifyAdminToken(token)) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url));
  }

  setAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin', request.url));
}
