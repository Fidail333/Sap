'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RequestModal } from './RequestModal';
import type { CatalogItem } from '@/lib/types';

export function CatalogCard({ item }: { item: CatalogItem }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-xl font-medium">{item.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
      <div className="mt-4 flex gap-3">
        <Link className="text-primary" href={`/modules/${item.slug}`}>Подробнее</Link>
        <button className="text-primary" onClick={() => setOpen(true)}>Запросить цену/наличие</button>
      </div>
      <RequestModal open={open} onClose={() => setOpen(false)} direction="MODULES" need={item.name} />
    </article>
  );
}
