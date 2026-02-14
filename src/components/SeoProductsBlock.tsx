import { CatalogCard } from './CatalogCard';
import type { CatalogProductItem } from '@/lib/types';

export function SeoProductsBlock({ items }: { items: CatalogProductItem[] }) {
  return (
    <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <CatalogCard key={item.id} item={item} />
      ))}
    </div>
  );
}
