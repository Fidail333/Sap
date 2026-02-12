'use client';

import { usePathname } from 'next/navigation';
import { JsonLd } from './JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export function BreadcrumbsJsonLd() {
  const pathname = usePathname();
  return <JsonLd data={breadcrumbSchema(pathname)} />;
}
