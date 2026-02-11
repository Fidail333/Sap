import type { Metadata } from 'next';
import { CatalogCard } from '@/components/CatalogCard';
import { Section } from '@/components/ui/Section';
import { productsData, getProductCategories } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Каталог LED-экранов | SAP LED Systems', 'Серии LED-экранов: indoor, outdoor, rental, COB и all-in-one.', '/products');

export default function ProductsPage() {
  const categories = getProductCategories();
  return (
    <main>
      <Section className="pb-8"><h1 className="text-4xl font-semibold">Каталог LED-серий</h1><p className="mt-4 max-w-3xl text-slate-300">8 продуктовых серий для различных сценариев внедрения и бюджета.</p></Section>
      <Section className="pt-0 pb-8"><div className="flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-300">{category}</span>)}</div></Section>
      <Section className="pt-0"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{productsData.map((item) => <CatalogCard key={item.slug} item={item} />)}</div></Section>
    </main>
  );
}
