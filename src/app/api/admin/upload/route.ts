export const runtime = 'nodejs';

import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { toSlug } from '@/lib/slug';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Требуется авторизация' } }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slugRaw = String(formData.get('slug') || 'image');

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Файл не выбран' } }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: { code: 'FILE_TOO_LARGE', message: 'Размер файла должен быть до 5MB' } }, { status: 400 });
    }

    const ext = allowedTypes.get(file.type);
    if (!ext) {
      return NextResponse.json({ ok: false, error: { code: 'INVALID_FILE_TYPE', message: 'Допустимы только JPG, PNG или WEBP' } }, { status: 400 });
    }

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const slug = toSlug(slugRaw);
    const fileName = `${slug}-${Date.now()}.${ext}`;

    const relativeDir = `/visuals/uploads/${year}/${month}`;
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir);
    await fs.mkdir(absoluteDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const absolutePath = path.join(absoluteDir, fileName);
    await fs.writeFile(absolutePath, buffer);

    return NextResponse.json({ ok: true, data: { path: `${relativeDir}/${fileName}` } });
  } catch (error) {
    console.error('Upload failed', error);
    return NextResponse.json(
      { ok: false, error: { code: 'UPLOAD_FAILED', message: 'Не удалось загрузить изображение', details: error instanceof Error ? error.message : undefined } },
      { status: 500 }
    );
  }
}
