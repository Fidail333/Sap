'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RequestModal } from './RequestModal';
import { Badge } from './ui/Badge';
import { formatAvailabilityLabel, formatPrice, productTechLabel } from '@/lib/product-format';
import type { ProductItem } from '@/lib/types';

export function CatalogCard({ item }: { item: ProductItem }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-cyan-300/50">
      <Image src={item.image} alt={item.name} width={1200} height={900} className="h-44 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">{item.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}</div>
        <h3 className="text-xl font-semibold text-white">{item.name}</h3>
        <p className="text-sm text-slate-300">{item.short_description}</p>
        <p className="text-base font-medium text-cyan-300">{formatPrice(item.price_rub)}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
          <span className="rounded-full border border-emerald-400/40 px-2 py-1 text-emerald-300">{formatAvailabilityLabel(item.availability)}</span>
          <span className="rounded-full border border-white/20 px-2 py-1">P{item.pitch_mm}</span>
          <span className="rounded-full border border-white/20 px-2 py-1">{item.environment}</span>
          <span className="rounded-full border border-white/20 px-2 py-1">{item.is_flexible ? 'Flexible' : 'Rigid'}</span>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <li>Tech: {productTechLabel(item)}</li>
          <li>Refresh: {item.refresh_hz ?? '—'} Hz</li>
          <li>Size: {item.size_mm ?? '—'}</li>
          <li>Scan: {item.scan ?? '—'}</li>
        </ul>
        <div className="flex gap-4 text-sm">
          <Link href={`/products/${item.id}`} className="text-cyan-300">Подробнее</Link>
          <button className="text-slate-100" onClick={() => setOpen(true)}>Запросить цену</button>
        </div>
      </div>
      <RequestModal open={open} onClose={() => setOpen(false)} product={item.name} />
    </article>
  );
}
