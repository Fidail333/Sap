'use client';

import { useEffect } from 'react';
import { RequestForm } from './RequestForm';

export function RequestModal({ open, onClose, product }: { open: boolean; onClose: () => void; product?: string }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex justify-end"><button onClick={onClose} className="rounded-lg border border-white/20 bg-slate-900 px-3 py-1 text-sm">Закрыть</button></div>
        <RequestForm initialProduct={product} onSuccess={onClose} />
      </div>
    </div>
  );
}
