import { blogPosts } from '@/data/blog';
import { ensureDatabaseSchema } from '@/lib/db-init';
import { getPrismaClient } from '@/lib/prisma';

export type BlogEntry = {
  id: string;
  createdAt: Date;
  type: 'Новости' | 'Статья';
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  coverAlt: string;
  imagePrompt: string;
  tags: string[];
  datePublished: string;
  dateModified: string;
};

function dbErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown DB error';
}


export async function getPublishedBlogEntries(): Promise<BlogEntry[]> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return blogPosts.map((item) => ({ ...item, id: item.slug, createdAt: new Date(item.datePublished) }));
  }

  try {
    await ensureDatabaseSchema();
    const [news, articles] = await Promise.all([
      prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
      prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
    ]);

    const dbEntries = [
      ...news.map((item) => mapContent(item, 'Новости')),
      ...articles.map((item) => mapContent(item, 'Статья'))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return dbEntries.length > 0 ? dbEntries : blogPosts.map((item) => ({ ...item, id: item.slug, createdAt: new Date(item.datePublished) }));
  } catch (error) {
    console.error('Failed SQL: prisma.news.findMany / prisma.article.findMany', error);
    return blogPosts.map((item) => ({ ...item, id: item.slug, createdAt: new Date(item.datePublished) }));
  }
}

export async function getPublishedBlogEntryBySlug(slug: string): Promise<BlogEntry | null> {
  const prisma = getPrismaClient();
  const staticItem = blogPosts.find((entry) => entry.slug === slug);
  const staticEntry = staticItem ? { ...staticItem, id: staticItem.slug, createdAt: new Date(staticItem.datePublished) } : null;

  if (!prisma) {
    return staticEntry;
  }

  try {
    await ensureDatabaseSchema();
    const [news, article] = await Promise.all([
      prisma.news.findFirst({ where: { slug, published: true } }),
      prisma.article.findFirst({ where: { slug, published: true } })
    ]);

    if (news) return mapContent(news, 'Новости');
    if (article) return mapContent(article, 'Статья');
    return staticEntry;
  } catch (error) {
    console.error('Failed SQL: prisma.news.findFirst / prisma.article.findFirst', error);
    return staticEntry;
  }
}

export async function getPublishedAdminProducts() {
  const prisma = getPrismaClient();
  if (!prisma) return [] as Array<{ id: string; title: string; image: string; description: string }>;

  try {
    await ensureDatabaseSchema();
    return await prisma.product.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Failed SQL: prisma.product.findMany', error);
    return [] as Array<{ id: string; title: string; image: string; description: string }>;
  }
}

function mapContent(item: { id: string; title: string; slug: string; description: string; content: string; image: string; createdAt: Date }, type: 'Новости' | 'Статья'): BlogEntry {
  return {
    id: item.id,
    type,
    createdAt: item.createdAt,
    title: item.title,
    metaTitle: item.title,
    metaDescription: item.description,
    slug: item.slug,
    excerpt: item.description,
    content: item.content,
    image: item.image,
    coverAlt: item.title,
    imagePrompt: '',
    tags: [type],
    datePublished: item.createdAt.toISOString(),
    dateModified: item.createdAt.toISOString()
  };
}

export type ContentKind = 'news' | 'article' | 'product';

export async function getAdminContent(kind: ContentKind) {
  const prisma = getPrismaClient();
  if (!prisma) return [];

  try {
    await ensureDatabaseSchema();
    if (kind === 'news') return prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    if (kind === 'article') return prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error(`Failed SQL: getAdminContent(${kind})`, error);
    return [];
  }
}

export async function createAdminContent(kind: ContentKind, data: { title: string; slug: string; description: string; content: string; image: string; published: boolean }) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is missing');

  try {
    await ensureDatabaseSchema();
    if (kind === 'news') return prisma.news.create({ data });
    if (kind === 'article') return prisma.article.create({ data });
    return prisma.product.create({ data });
  } catch (error) {
    console.error(`Failed SQL: createAdminContent(${kind})`, error);
    throw new Error(dbErrorMessage(error));
  }
}

export async function updateAdminContent(kind: ContentKind, id: string, data: { title: string; slug: string; description: string; content: string; image: string; published: boolean }) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is missing');

  try {
    await ensureDatabaseSchema();
    if (kind === 'news') return prisma.news.update({ where: { id }, data });
    if (kind === 'article') return prisma.article.update({ where: { id }, data });
    return prisma.product.update({ where: { id }, data });
  } catch (error) {
    console.error(`Failed SQL: updateAdminContent(${kind})`, error);
    throw new Error(dbErrorMessage(error));
  }
}

export async function deleteAdminContent(kind: ContentKind, id: string) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is missing');

  try {
    await ensureDatabaseSchema();
    if (kind === 'news') return prisma.news.delete({ where: { id } });
    if (kind === 'article') return prisma.article.delete({ where: { id } });
    return prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error(`Failed SQL: deleteAdminContent(${kind})`, error);
    throw new Error(dbErrorMessage(error));
  }
}

export async function getLeads() {
  const prisma = getPrismaClient();
  if (!prisma) return [] as Array<{ id: string; name: string; contact: string; message: string; source: string; status: string; createdAt: Date }>;

  try {
    await ensureDatabaseSchema();
    return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.findMany', error);
    return [] as Array<{ id: string; name: string; contact: string; message: string; source: string; status: string; createdAt: Date }>;
  }
}

export async function updateLeadStatus(id: string, status: 'new' | 'in_progress' | 'done') {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is missing');

  try {
    await ensureDatabaseSchema();
    return prisma.lead.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.update', error);
    throw new Error(dbErrorMessage(error));
  }
}

export async function createLead(data: { name: string; contact: string; message: string; source: 'chat' | 'form' | 'admin' }) {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new Error('DATABASE_URL is missing');
  }

  try {
    await ensureDatabaseSchema();
    return await prisma.lead.create({ data });
  } catch (error) {
    console.error('Failed SQL: prisma.lead.create', error);
    throw new Error(dbErrorMessage(error));
  }
}
