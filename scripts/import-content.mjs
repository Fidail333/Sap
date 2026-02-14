import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toSlug(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function loadBlogPostsFromTs() {
  const filePath = path.join(process.cwd(), 'src/data/blog.ts');
  const raw = await fs.readFile(filePath, 'utf8');
  const start = raw.indexOf('export const blogPosts');
  const arrayStart = raw.indexOf('[', start);
  const arrayEnd = raw.lastIndexOf('];');
  const arrayLiteral = raw.slice(arrayStart, arrayEnd + 1);
  return Function(`"use strict"; return (${arrayLiteral});`)();
}

async function loadJsonItems() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = await fs.readdir(contentDir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));
  const parsed = [];

  for (const file of jsonFiles) {
    const raw = await fs.readFile(path.join(contentDir, file), 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data)) parsed.push(...data);
  }

  return parsed;
}

function normalizeItems(items) {
  return items
    .filter((item) => item && item.title && item.content)
    .map((item) => ({
      title: String(item.title).trim(),
      slug: toSlug(item.slug || item.title),
      description: String(item.description || item.excerpt || '').trim() || null,
      content: String(item.content).trim(),
      image: String(item.image || '').trim() || null,
      published: item.published ?? true,
      type: String(item.type || 'Статья')
    }));
}

async function run() {
  const jsonItems = await loadJsonItems();
  const blogPosts = await loadBlogPostsFromTs();
  const merged = normalizeItems([
    ...jsonItems,
    ...blogPosts.map((item) => ({
      title: item.title,
      slug: item.slug,
      description: item.excerpt,
      content: item.content,
      image: item.image,
      type: item.type,
      published: true
    }))
  ]);

  let newsCount = 0;
  let articleCount = 0;

  for (const item of merged) {
    const data = {
      title: item.title,
      description: item.description,
      content: item.content,
      image: item.image,
      published: item.published
    };

    if (item.type.toLowerCase().includes('новост')) {
      await prisma.news.upsert({ where: { slug: item.slug }, create: { slug: item.slug, ...data }, update: data });
      newsCount += 1;
    } else {
      await prisma.article.upsert({ where: { slug: item.slug }, create: { slug: item.slug, ...data }, update: data });
      articleCount += 1;
    }
  }

  console.log(`Imported: news=${newsCount}, articles=${articleCount}`);
}

run()
  .catch((error) => {
    console.error('Import failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
