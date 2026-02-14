import { Prisma } from '@prisma/client';
import { ADMIN_DEMO_CONTENT } from '@/lib/admin-demo-content';
import { getPrismaClient } from '@/lib/prisma';
import { ensureUniqueSlug, toSlug } from '@/lib/slug';

export type BlogEntry = {
  id: string;
  createdAt: Date;
  type: 'Новости' | 'Статья';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  published: boolean;
};

export type ContentKind = 'news' | 'article';

export type ContentPayload = {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  image?: string;
  published: boolean;
};

export type ServiceResult<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
};

function mapContent(
  item: { id: string; title: string; slug: string; description: string | null; content: string; image: string | null; createdAt: Date; published: boolean },
  type: 'Новости' | 'Статья'
): BlogEntry {
  return {
    id: item.id,
    type,
    createdAt: item.createdAt,
    title: item.title,
    slug: item.slug,
    excerpt: item.description ?? '',
    content: item.content,
    image: item.image ?? '/visuals/reference.png',
    tags: [type],
    published: item.published
  };
}

function normalizePayload(payload: ContentPayload) {
  return {
    title: payload.title.trim(),
    slug: payload.slug?.trim() || toSlug(payload.title),
    description: payload.description?.trim() || null,
    content: payload.content.trim(),
    image: payload.image?.trim() || null,
    published: Boolean(payload.published)
  };
}

function toServiceError(error: unknown, fallback = 'Не удалось выполнить операцию'): ServiceResult<never>['error'] {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { code: 'SLUG_EXISTS', message: 'Slug уже используется', details: error.message };
    }

    return { code: error.code, message: 'Ошибка базы данных', details: error.message };
  }

  if (error instanceof Error) {
    return { code: 'UNKNOWN', message: fallback, details: error.message };
  }

  return { code: 'UNKNOWN', message: fallback };
}

function getModel(kind: ContentKind, prisma: ReturnType<typeof getPrismaClient>) {
  return kind === 'news' ? prisma.news : prisma.article;
}

export async function getPublishedBlogEntries(): Promise<BlogEntry[]> {
  const prisma = getPrismaClient();

  try {
    const [news, articles] = await Promise.all([
      prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
      prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
    ]);

    return [...news.map((item) => mapContent(item, 'Новости')), ...articles.map((item) => mapContent(item, 'Статья'))].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error('Failed SQL: prisma.news.findMany / prisma.article.findMany', error);
    return [];
  }
}

export async function getPublishedBlogEntryBySlug(slug: string): Promise<BlogEntry | null> {
  const prisma = getPrismaClient();

  try {
    const [news, article] = await Promise.all([
      prisma.news.findFirst({ where: { slug, published: true } }),
      prisma.article.findFirst({ where: { slug, published: true } })
    ]);

    if (news) return mapContent(news, 'Новости');
    if (article) return mapContent(article, 'Статья');
    return null;
  } catch (error) {
    console.error('Failed SQL: prisma.news.findFirst / prisma.article.findFirst', error);
    return null;
  }
}

export async function getAdminContent(kind: ContentKind) {
  const prisma = getPrismaClient();

  try {
    return await getModel(kind, prisma).findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error(`Failed SQL: getAdminContent(${kind})`, error);
    return [];
  }
}

export async function createAdminContent(kind: ContentKind, payload: ContentPayload): Promise<ServiceResult<{ id: string }>> {
  const prisma = getPrismaClient();
  const normalized = normalizePayload(payload);

  if (!normalized.title || !normalized.content) {
    return { ok: false, error: { code: 'VALIDATION', message: 'Заполните заголовок и контент' } };
  }

  try {
    const slug = await ensureUniqueSlug({
      prisma,
      kind,
      slug: normalized.slug,
      excludeId: undefined
    });

    const created = await getModel(kind, prisma).create({
      data: {
        title: normalized.title,
        slug,
        description: normalized.description,
        content: normalized.content,
        image: normalized.image,
        published: normalized.published
      }
    });

    return { ok: true, data: { id: created.id } };
  } catch (error) {
    console.error(`Failed SQL: createAdminContent(${kind})`, error);
    return { ok: false, error: toServiceError(error, 'Не удалось создать запись') };
  }
}

export async function updateAdminContent(kind: ContentKind, id: string, payload: ContentPayload): Promise<ServiceResult<{ id: string }>> {
  const prisma = getPrismaClient();
  const normalized = normalizePayload(payload);

  if (!id) return { ok: false, error: { code: 'VALIDATION', message: 'Не указан ID записи' } };

  try {
    const slug = await ensureUniqueSlug({ prisma, kind, slug: normalized.slug, excludeId: id });

    const updated = await getModel(kind, prisma).update({
      where: { id },
      data: {
        title: normalized.title,
        slug,
        description: normalized.description,
        content: normalized.content,
        image: normalized.image,
        published: normalized.published
      }
    });

    return { ok: true, data: { id: updated.id } };
  } catch (error) {
    console.error(`Failed SQL: updateAdminContent(${kind})`, error);
    return { ok: false, error: toServiceError(error, 'Не удалось обновить запись') };
  }
}

export async function deleteAdminContent(kind: ContentKind, id: string): Promise<ServiceResult<{ id: string }>> {
  const prisma = getPrismaClient();

  try {
    const deleted = await getModel(kind, prisma).delete({ where: { id } });
    return { ok: true, data: { id: deleted.id } };
  } catch (error) {
    console.error(`Failed SQL: deleteAdminContent(${kind})`, error);
    return { ok: false, error: toServiceError(error, 'Не удалось удалить запись') };
  }
}

export async function getLeads() {
  const prisma = getPrismaClient();
  try {
    return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.findMany', error);
    return [];
  }
}

export async function updateLeadStatus(id: string, status: 'new' | 'in_progress' | 'done') {
  const prisma = getPrismaClient();
  try {
    await prisma.lead.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.update', error);
    throw new Error('Не удалось обновить статус заявки');
  }
}

export async function createLead(data: { name: string; contact: string; message: string; source: 'chat' | 'form' | 'admin' }) {
  const prisma = getPrismaClient();
  try {
    return await prisma.lead.create({ data });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.create', error);
    throw new Error('Не удалось сохранить заявку');
  }
}

export async function bootstrapAdminDemoContent(): Promise<ServiceResult<{ created: number }>> {
  let created = 0;

  for (const item of ADMIN_DEMO_CONTENT) {
    const result = await createAdminContent(item.kind, item.payload);
    if (!result.ok && result.error?.code !== 'SLUG_EXISTS') {
      return { ok: false, error: result.error };
    }
    if (result.ok) created += 1;
  }

  return { ok: true, data: { created } };
}
