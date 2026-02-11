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
      siteName: 'SAP LED Systems',
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
  name: 'SAP LED Systems',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Москва',
    streetAddress: 'Ленинградский пр-т, 37к3'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+7-495-145-88-40',
    email: 'sales@sap-led.ru'
  }
};

export function productSchema(name: string, description: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: 'SAP LED Systems' },
    url: `${siteUrl}/products/${slug}`
  };
}
