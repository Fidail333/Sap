import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function buildMetadata(title: string, description: string, path = ''): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: path || '/' },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Sapphire LED',
      type: 'website',
      locale: 'ru_RU',
      images: [{ url: '/visuals/hero-led-wall.svg', width: 1400, height: 900 }]
    },
    twitter: { card: 'summary_large_image', title, description }
  };
}

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sapphire LED',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    streetAddress: 'ул Горбунова, д. 2, стр. 3, Помещ. 18/8'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+7-903-110-84-67',
    email: 'mail@led-modules.ru'
  }
};

export function productSchema(name: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'Sapphire LED' },
    url: `${siteUrl}/products/${slug}`
  };
}
