import { blogPosts } from '@/data/blog';
import { getPrismaClient } from '@/lib/prisma';

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
};

export async function getPublishedBlogEntries(): Promise<BlogEntry[]> {
  const prisma = getPrismaClient();

  if (!prisma) {
    return blogPosts.map((item, index) => ({ ...item, id: item.slug, createdAt: new Date(Date.now() - index * 1000) }));
  }

  try {
    const [news, articles] = await Promise.all([
      prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
      prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
    ]);

    return [
      ...news.map((item) => mapContent(item, 'Новости')),
      ...articles.map((item) => mapContent(item, 'Статья'))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Failed to load blog entries from DB', error);
    return blogPosts.map((item, index) => ({ ...item, id: item.slug, createdAt: new Date(Date.now() - index * 1000) }));
  }
}

export async function getPublishedBlogEntryBySlug(slug: string): Promise<BlogEntry | null> {
  const prisma = getPrismaClient();
  if (!prisma) {
    const item = blogPosts.find((entry) => entry.slug === slug);
    return item ? { ...item, id: item.slug, createdAt: new Date() } : null;
  }

  try {
    const [news, article] = await Promise.all([
      prisma.news.findFirst({ where: { slug, published: true } }),
      prisma.article.findFirst({ where: { slug, published: true } })
    ]);

    if (news) return mapContent(news, 'Новости');
    if (article) return mapContent(article, 'Статья');
    return null;
  } catch (error) {
    console.error('Failed to load blog entry by slug', error);
    const item = blogPosts.find((entry) => entry.slug === slug);
    return item ? { ...item, id: item.slug, createdAt: new Date() } : null;
  }
}

export async function getPublishedAdminProducts() {
  const prisma = getPrismaClient();
  if (!prisma) return [] as Array<{ id: string; title: string; image: string; description: string }>;

  try {
    return await prisma.product.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Failed to load admin products', error);
    return [] as Array<{ id: string; title: string; image: string; description: string }>;
  }
}

function mapContent(item: { id: string; title: string; slug: string; description: string; content: string; image: string; createdAt: Date }, type: 'Новости' | 'Статья'): BlogEntry {
  return {
    id: item.id,
    type,
    createdAt: item.createdAt,
    title: item.title,
    slug: item.slug,
    excerpt: item.description,
    content: item.content,
    image: item.image,
    tags: [type]
  };
}

export type ContentKind = 'news' | 'article' | 'product';

export async function getAdminContent(kind: ContentKind) {
  const prisma = getPrismaClient();
  if (!prisma) return [];

  if (kind === 'news') return prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  if (kind === 'article') return prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createAdminContent(kind: ContentKind, data: { title: string; slug: string; description: string; content: string; image: string; published: boolean }) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is not configured');

  if (kind === 'news') return prisma.news.create({ data });
  if (kind === 'article') return prisma.article.create({ data });
  return prisma.product.create({ data });
}

export async function updateAdminContent(kind: ContentKind, id: string, data: { title: string; slug: string; description: string; content: string; image: string; published: boolean }) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is not configured');

  if (kind === 'news') return prisma.news.update({ where: { id }, data });
  if (kind === 'article') return prisma.article.update({ where: { id }, data });
  return prisma.product.update({ where: { id }, data });
}

export async function deleteAdminContent(kind: ContentKind, id: string) {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is not configured');

  if (kind === 'news') return prisma.news.delete({ where: { id } });
  if (kind === 'article') return prisma.article.delete({ where: { id } });
  return prisma.product.delete({ where: { id } });
}

export async function getLeads() {
  const prisma = getPrismaClient();
  if (!prisma) return [] as Array<{ id: string; name: string; contact: string; message: string; source: string; status: string; createdAt: Date }>;

  return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateLeadStatus(id: string, status: 'new' | 'in_progress' | 'done') {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error('DATABASE_URL is not configured');

  return prisma.lead.update({ where: { id }, data: { status } });
}

export async function createLead(data: { name: string; contact: string; message: string; source: 'chat' | 'form' | 'admin' }) {
  const prisma = getPrismaClient();
  if (!prisma) {
    return null;
  }

  try {
    return await prisma.lead.create({ data });
  } catch (error) {
    console.error('Failed to save lead', error);
    return null;
  }
}
