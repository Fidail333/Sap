import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Section } from '@/components/ui/Section';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { displayProductsData, moduleProductsData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Каталог LED-решений | Sapphire LED', 'Каталог направлений: LED-модули Meiyad и премиальные LED-экраны SAPPHIRE SCIH/SCA.', '/products');

export default function ProductsPage() {
  return (
    <main>
      <Section className="pb-6 md:pb-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Каталог</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Выберите направление: модульные решения Meiyad или премиальные кабинеты и all-in-one экраны SAPPHIRE.</p>
      </Section>
      <Section className="pt-0">
        <Suspense fallback={<p className="text-slate-300">Загрузка каталога...</p>}>
          <ProductsCatalog modules={moduleProductsData} displays={displayProductsData} />
        </Suspense>
      </Section>
    </main>
  );
}
