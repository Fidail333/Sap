'use client';

import { useState } from 'react';
import { RequestModal } from './RequestModal';

export function ProductContactButton({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-[0.99] sm:w-auto"
      >
        Связаться с инженером
      </button>
      <RequestModal open={open} onClose={() => setOpen(false)} product={{ id: productId, name: productName }} />
    </>
  );
}
