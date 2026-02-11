'use client';

import { useEffect } from 'react';
import { RequestForm } from './RequestForm';

type RequestModalProps = {
  open: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
  };
};

export function RequestModal({ open, onClose, product }: RequestModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          className="relative w-full max-w-[calc(100vw-24px)] max-h-[calc(100vh-24px)] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-5 sm:max-w-[640px] sm:p-6"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Связаться с инженером"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-slate-900/80 text-slate-100 transition hover:bg-slate-800"
            aria-label="Закрыть"
          >
            ✕
          </button>
          <h3 className="pr-10 text-2xl font-semibold text-white">Связаться с инженером</h3>
          <p className="mt-2 text-sm text-slate-300">Оставьте контакты — инженер уточнит параметры и предложит решение.</p>
          <div className="mt-5">
            <RequestForm initialProductName={product?.name} initialProductId={product?.id} onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
