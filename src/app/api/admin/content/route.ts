export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createAdminContent, deleteAdminContent, getAdminContent, updateAdminContent, type ContentKind } from '@/lib/cms';
import { isAdminAuthenticated } from '@/lib/admin-auth';

function authError() {
  return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Требуется авторизация' } }, { status: 401 });
}

function validateKind(value: string): ContentKind | null {
  return value === 'news' || value === 'article' ? value : null;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) return authError();

  const url = new URL(request.url);
  const kind = validateKind(url.searchParams.get('kind') || '');

  if (!kind) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Неверный тип контента' } }, { status: 400 });
  }

  const items = await getAdminContent(kind);
  return NextResponse.json({ ok: true, data: items });
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return authError();

  const body = await request.json();
  const kind = validateKind(String(body.kind || ''));

  if (!kind) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Неверный тип контента' } }, { status: 400 });
  }

  const result = await createAdminContent(kind, {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    description: String(body.description || ''),
    content: String(body.content || ''),
    image: String(body.image || ''),
    published: Boolean(body.published)
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) return authError();

  const body = await request.json();
  const kind = validateKind(String(body.kind || ''));
  const id = String(body.id || '');

  if (!kind || !id) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Неверные данные запроса' } }, { status: 400 });
  }

  const result = await updateAdminContent(kind, id, {
    title: String(body.title || ''),
    slug: String(body.slug || ''),
    description: String(body.description || ''),
    content: String(body.content || ''),
    image: String(body.image || ''),
    published: Boolean(body.published)
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return authError();

  const body = await request.json();
  const kind = validateKind(String(body.kind || ''));
  const id = String(body.id || '');

  if (!kind || !id) {
    return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Неверные данные запроса' } }, { status: 400 });
  }

  const result = await deleteAdminContent(kind, id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
