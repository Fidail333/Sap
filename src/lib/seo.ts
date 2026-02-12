import type { Metadata } from 'next';
import type { CatalogProductItem } from './types';

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
    twitter: { card: 'summary_large_image', title, description, images: ['/visuals/hero-led-wall.svg'] }
  };
}

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sapphire LED',
  url: siteUrl,
  telephone: '+7-903-110-84-67',
  email: 'mail@led-modules.ru',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressLocality: 'Москва',
    streetAddress: 'ул Горбунова, д. 2, стр. 3, Помещ. 18/8'
  },
  openingHours: 'Mo-Fr 09:00-18:00',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+7-903-110-84-67',
    email: 'mail@led-modules.ru',
    areaServed: 'RU',
    availableLanguage: ['ru']
  }
};

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sapphire LED',
    url: siteUrl
  };
}

export function breadcrumbSchema(path: string) {
  const segments = path.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    catalog: 'Каталог',
    products: 'Каталог',
    contacts: 'Контакты',
    about: 'О компании',
    privacy: 'Политика конфиденциальности',
    blog: 'Материалы',
    'led-ekrany': 'LED-экраны',
    'ulichnye-led-ekrany': 'Уличные LED-экраны',
    'reklamnye-led-ekrany': 'Рекламные LED-экраны',
    'bolshie-led-ekrany': 'Большие LED-экраны',
    'indoor-led-ekrany': 'LED-экраны для помещений',
    'outdoor-led-ekrany': 'LED-экраны для улицы',
    resheniya: 'Решения',
    'naruzhnaya-reklama': 'Наружная реклама',
    bilbordy: 'Билборды',
    'stseny-i-meropriyatiya': 'Сцены и мероприятия',
    'dispetcherskie-tsentry': 'Диспетчерские центры',
    'riteyl-i-vitriny': 'Ритейл и витрины'
  };

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: siteUrl
    }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: labels[segment] ?? segment,
      item: `${siteUrl}${currentPath}`
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function productSchema(name: string, description: string, slug: string, image = '/visuals/hero-led-wall.svg', priceRub?: number | null, availability: 'in_stock' | 'preorder' | null = 'preorder') {
  const availabilityValue = availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder';
  const offers = priceRub
    ? {
      '@type': 'Offer',
      url: `${siteUrl}/products/${slug}`,
      price: String(priceRub),
      priceCurrency: 'RUB',
      availability: availabilityValue
    }
    : {
      '@type': 'Offer',
      url: `${siteUrl}/products/${slug}`,
      priceCurrency: 'RUB',
      availability: availabilityValue
    };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: `${siteUrl}${image}`,
    brand: { '@type': 'Brand', name: 'Sapphire LED' },
    url: `${siteUrl}/products/${slug}`,
    offers
  };
}

export function productListSchema(items: CatalogProductItem[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: productSchema(
        item.name,
        item.catalog_type === 'modules' ? item.short_description : item.description,
        item.id,
        item.image,
        item.price_rub,
        item.availability
      )
    }))
  };
}

export function articleSchema({ title, description, path, image }: { title: string; description: string; path: string; image: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: `${siteUrl}${image}`,
    author: {
      '@type': 'Organization',
      name: 'Sapphire LED'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sapphire LED'
    },
    mainEntityOfPage: `${siteUrl}${path}`
  };
}
