import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Section } from '@/components/ui/Section';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { productsData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Каталог LED-модулей | Sapphire LED', 'Каталог: indoor/outdoor модули, фильтры по шагу пикселя, технологии, размеру и наличию.', '/products');

export default function ProductsPage() {
  return (
    <main>
      <Section className="pb-8">
        <h1 className="text-4xl font-semibold">Каталог</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Подберите LED-модули по среде эксплуатации, шагу пикселя, технологии и цене.</p>
      </Section>
      <Section className="pt-0">
        <Suspense fallback={<p className="text-slate-300">Загрузка каталога...</p>}>
          <ProductsCatalog products={productsData} />
        </Suspense>
      </Section>
    </main>
  );
}
