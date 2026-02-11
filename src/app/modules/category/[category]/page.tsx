import { notFound } from 'next/navigation';
import { CatalogCard } from '@/components/CatalogCard';
import { modulesData } from '@/lib/content';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = modulesData.categories.find((item) => item.slug === params.category);
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold">{category.name}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {category.items.map((item) => (
          <CatalogCard key={item.slug} item={item} />
        ))}
      </div>
    </main>
  );
}
