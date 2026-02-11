'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RequestModal } from './RequestModal';
import { Badge } from './ui/Badge';
import type { ProductItem } from '@/lib/types';

export function CatalogCard({ item }: { item: ProductItem }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-cyan-300/50">
      <Image src={item.gallery[0]} alt={item.name} width={1200} height={800} className="h-44 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">{item.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>
        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
        <p className="text-sm text-slate-300">{item.shortDescription}</p>
        <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <li>Pitch: {item.specs.pixelPitch}</li>
          <li>Яркость: {item.specs.brightness}</li>
          <li>Refresh: {item.specs.refreshRate}</li>
          <li>IP: {item.specs.ipRating}</li>
        </ul>
        <div className="flex gap-4 text-sm">
          <Link href={`/products/${item.slug}`} className="text-cyan-300">Подробнее</Link>
          <button className="text-slate-100" onClick={() => setOpen(true)}>Запросить цену</button>
        </div>
      </div>
      <RequestModal open={open} onClose={() => setOpen(false)} product={item.name} />
    </article>
  );
}
