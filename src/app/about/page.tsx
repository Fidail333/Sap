import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('О компании | SAP LED', 'О проекте объединенного сайта Sapphire и LED Modules.', '/about');

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-semibold">О компании</h1>
      <p className="mt-4 text-slate-600">
        Мы объединили экспертизу двух направлений — брендовые светотехнические решения Sapphire
        и модульные комплектующие LED Modules — в одном удобном интерфейсе для B2B-заявок.
      </p>
    </main>
  );
}
