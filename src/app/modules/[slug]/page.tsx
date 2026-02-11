import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RequestForm } from '@/components/RequestForm';
import { JsonLd } from '@/components/JsonLd';
import { getModuleBySlug } from '@/lib/content';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getModuleBySlug(params.slug);
  if (!item) return {};
  return {
    title: `${item.name} | LED Modules`,
    description: item.description
  };
}

export default function ModuleCardPage({ params }: { params: { slug: string } }) {
  const item = getModuleBySlug(params.slug);
  if (!item) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    category: item.categoryName,
    url: item.source_url
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Modules', item: '/modules' },
      { '@type': 'ListItem', position: 3, name: item.name, item: `/modules/${item.slug}` }
    ]
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbs} />
      <Link href="/modules" className="text-primary">← Назад в каталог</Link>
      <h1 className="mt-4 text-4xl font-semibold">{item.name}</h1>
      <p className="mt-3 text-slate-600">{item.description}</p>
      <div className="mt-6 rounded-xl border border-slate-200 p-5">
        <h2 className="text-xl font-medium">Характеристики</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {Object.entries(item.specs).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <RequestForm initialDirection="MODULES" initialNeed={item.name} />
      </div>
    </main>
  );
}
