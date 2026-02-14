import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-init';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const health = await checkDatabaseHealth();

    if (!health.ok) {
      return NextResponse.json({ ok: false, error: health.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown DB error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
