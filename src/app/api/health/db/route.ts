import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-init';

export const runtime = 'nodejs';

export async function GET() {
  const health = await checkDatabaseHealth();

  if (!health.ok) {
    return NextResponse.json({ ok: false, error: health.error || 'DATABASE_URL is missing' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
