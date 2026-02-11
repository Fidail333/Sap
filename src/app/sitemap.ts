import type { MetadataRoute } from 'next';
import { productsData } from '@/lib/content';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/products', '/cases', '/about', '/contacts', '/request'];
  const productRoutes = productsData.map((item) => `/products/${item.id}`);

  return [...staticRoutes, ...productRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.75
  }));
}
