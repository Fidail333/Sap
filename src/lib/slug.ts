import type { PrismaClient } from '@prisma/client';
import type { ContentKind } from '@/lib/cms';

const translitMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '',
  ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

export function toSlug(input: string) {
  const transliterated = input
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => translitMap[char] ?? char)
    .join('');

  return (
    transliterated
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') ||
    `entry-${Date.now()}`
  );
}

function model(kind: ContentKind, prisma: PrismaClient) {
  return kind === 'news' ? prisma.news : prisma.article;
}

export async function ensureUniqueSlug({ prisma, kind, slug, excludeId }: { prisma: PrismaClient; kind: ContentKind; slug: string; excludeId?: string }) {
  const base = toSlug(slug);
  let candidate = base;
  let index = 2;

  while (true) {
    const existing = await model(kind, prisma).findFirst({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${index}`;
    index += 1;
  }
}
