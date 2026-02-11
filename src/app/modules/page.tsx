import type { Metadata } from 'next';
import { CatalogCard } from '@/components/CatalogCard';
import { modulesData } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('LED Modules | SAP LED', 'Каталог комплектующих LED Modules.', '/modules');

export default function ModulesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Комплектующие и модули</h1>
      {modulesData.categories.map((category) => (
        <section key={category.slug} className="mt-10">
          <h2 className="text-2xl font-medium">
            <a className="hover:text-primary" href={`/modules/category/${category.slug}`}>{category.name}</a>
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {category.items.map((item) => (
              <CatalogCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
