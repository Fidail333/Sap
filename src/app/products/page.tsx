import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { productsData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Каталог LED-экранов Meiyad | SAP LED Systems', 'Каталог Meiyad: indoor/outdoor модули, фильтры по шагу пикселя, технологии, размеру и наличию.', '/products');

function toSearchParamsString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      params.set(key, value);
      return;
    }

    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    }
  });

  return params.toString();
}

export default function ProductsPage({ searchParams = {} }: { searchParams?: Record<string, string | string[] | undefined> }) {
  return (
    <main>
      <Section className="pb-8">
        <h1 className="text-4xl font-semibold">Каталог Meiyad</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Подберите LED-модули по среде эксплуатации, шагу пикселя, технологии и цене.</p>
      </Section>
      <Section className="pt-0">
        <ProductsCatalog products={productsData} initialSearchParams={toSearchParamsString(searchParams)} />
      </Section>
    </main>
  );
}
