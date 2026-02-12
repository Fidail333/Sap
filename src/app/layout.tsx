import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd';
import { AnalyticsScripts } from '@/components/AnalyticsScripts';
import { buildMetadata, orgSchema, websiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildMetadata(
    'Sapphire LED — премиальные LED-экраны для B2B',
    'Проектирование, поставка, монтаж и сервис LED-экранов для indoor, outdoor, rental и корпоративных пространств.',
    '/'
  )
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema()} />
        <BreadcrumbsJsonLd />
        <AnalyticsScripts />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
