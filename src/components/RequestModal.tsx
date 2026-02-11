'use client';

import { useEffect } from 'react';
import { RequestForm } from './RequestForm';
import type { Direction } from '@/lib/types';

export function RequestModal({ open, onClose, direction, need }: { open: boolean; onClose: () => void; direction: Direction; need?: string }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-white px-3 py-1 text-sm">Закрыть</button>
        </div>
        <RequestForm initialDirection={direction} initialNeed={need || ''} onSuccess={onClose} />
      </div>
    </div>
  );
}
