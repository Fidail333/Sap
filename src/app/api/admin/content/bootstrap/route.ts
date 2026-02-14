export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { bootstrapAdminDemoContent, getAdminContent } from '@/lib/cms';

export async function POST() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Требуется авторизация' } }, { status: 401 });
  }

  const result = await bootstrapAdminDemoContent();
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  const [news, article] = await Promise.all([getAdminContent('news'), getAdminContent('article')]);
  return NextResponse.json({ ok: true, data: { news, article, created: result.data?.created ?? 0 } });
}
