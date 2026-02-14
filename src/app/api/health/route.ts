import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-init';

export async function GET() {
  const health = await checkDatabaseHealth();
  if (!health.ok) {
    return NextResponse.json(health, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
