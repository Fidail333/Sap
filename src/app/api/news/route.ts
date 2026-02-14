import { NextResponse } from 'next/server';
import { createAdminContent, getAdminContent } from '@/lib/cms';

export async function GET() {
  try {
    const items = await getAdminContent('news');
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed SQL: GET /api/news', error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      slug?: string;
      description?: string;
      content?: string;
      image?: string;
      published?: boolean;
    };

    const payload = {
      title: String(body.title || '').trim(),
      slug: String(body.slug || '').trim(),
      description: String(body.description || '').trim(),
      content: String(body.content || '').trim(),
      image: String(body.image || '').trim(),
      published: Boolean(body.published)
    };

    if (!payload.title || !payload.slug || !payload.content || !payload.image) {
      return NextResponse.json({ ok: false, error: 'title, slug, content, image are required' }, { status: 400 });
    }

    const created = await createAdminContent('news', payload);
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed SQL: POST /api/news', error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
