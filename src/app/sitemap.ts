import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { productsData } from '@/lib/content';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/products', '/about', '/contacts', '/blog', '/privacy'];
  const productRoutes = productsData.map((item) => `/products/${item.id}`);
  const blogRoutes = blogPosts.map((item) => `/blog/${item.slug}`);

  return [...staticRoutes, ...productRoutes, ...blogRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.75
  }));
}
