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
      siteName: 'SAP LED',
      type: 'website',
      locale: 'ru_RU'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SAP LED',
  url: siteUrl,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+7-495-000-00-00'
  }
};
