import type { Metadata } from 'next';
import { Suspense } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/ui/Section';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { displayProductsData, moduleProductsData, productsData } from '@/lib/content';
import { buildMetadata, productListSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = buildMetadata('Каталог LED-экранов и модулей | Sapphire LED', 'Каталог LED-экранов: уличные, indoor, рекламные и большие решения для бизнеса и объектов в РФ.', '/catalog');

export default async function CatalogPage() {

  return (
    <main>
      <JsonLd data={productListSchema(productsData.slice(0, 12), 'Каталог LED-экранов Sapphire LED')} />
      <Section className="pb-6 md:pb-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Каталог</h1>
        <p className="mt-3 max-w-4xl text-slate-300">Каталог Sapphire LED включает LED экраны и модули для наружной рекламы, корпоративных пространств, ритейла и сценических площадок. Здесь можно сравнить уличные и интерьерные серии по шагу пикселя, яркости, частоте обновления и доступности. Мы сохраняем инженерный подход к подбору: для каждой задачи важны дистанция просмотра, условия эксплуатации и требования к контенту. Используйте фильтры, чтобы быстро выбрать рекламные LED экраны, большие LED экраны для фасадов или светодиодные экраны для бизнеса с точной цветопередачей для помещений.</p>
      </Section>
      <Section className="pt-0">
        <h2 className="text-2xl font-semibold">Подбор моделей и фильтрация</h2>
        <p className="mt-2 text-sm text-slate-400">Фильтры помогут сузить выбор по ключевым техническим параметрам без изменения маршрутов каталога.</p>
        <Suspense fallback={<p className="text-slate-300">Загрузка каталога...</p>}>
          <ProductsCatalog modules={moduleProductsData} displays={displayProductsData} />
        </Suspense>
      </Section>
          </main>
  );
}
