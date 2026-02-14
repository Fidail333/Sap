export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createAdminContent, getAdminContent } from '@/lib/cms';

export async function GET() {
  const items = await getAdminContent('news');
  return NextResponse.json({ ok: true, data: items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createAdminContent('news', {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    description: String(body.description || ''),
    content: String(body.content || ''),
    image: String(body.image || ''),
    published: Boolean(body.published)
  });

  return NextResponse.json(result, { status: result.ok ? 201 : 400 });
}
