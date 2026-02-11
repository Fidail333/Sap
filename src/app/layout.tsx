import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata, orgSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(
  'Sapphire + LED Modules',
  'Единая витрина решений Sapphire и комплектующих LED Modules.',
  '/'
);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={orgSchema} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
