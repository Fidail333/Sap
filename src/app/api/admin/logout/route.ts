export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  clearAdminSessionCookie();
  return NextResponse.redirect(new URL('/admin/login', request.url));
}
