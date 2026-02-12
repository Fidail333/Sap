import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/ui/Section';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { displayProductsData, moduleProductsData, productsData } from '@/lib/content';
import { buildMetadata, productListSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Каталог LED-экранов и модулей | Sapphire LED', 'Каталог LED-экранов: уличные, indoor, рекламные и большие решения для бизнеса и объектов в РФ.', '/catalog');

export default function CatalogPage() {
  return (
    <main>
      <JsonLd data={productListSchema(productsData.slice(0, 12), 'Каталог LED-экранов Sapphire LED')} />
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
