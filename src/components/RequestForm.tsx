'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { productsData } from '@/lib/content';

export function RequestForm({ initialProduct = '', onSuccess, redirectOnSuccess = false }: { initialProduct?: string; onSuccess?: () => void; redirectOnSuccess?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submitAction(formData: FormData) {
    setStatus('loading');
    setError('');
    const response = await fetch('/api/request', { method: 'POST', body: formData });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Не удалось отправить заявку');
      setStatus('error');
      return;
    }
    setStatus('success');
    onSuccess?.();
    if (redirectOnSuccess) router.push('/request/thanks');
  }

  return (
    <form action={submitAction} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required placeholder="Имя" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
        <input name="phone" required placeholder="Телефон" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
        <input name="email" required type="email" placeholder="Email" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
        <input name="company" placeholder="Компания" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
      </div>
      <select name="product" defaultValue={initialProduct} className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3">
        <option value="">Интересующий продукт</option>
        {productsData.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
      </select>
      <textarea name="comment" rows={4} placeholder="Комментарий" className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" />
      <label className="flex items-start gap-2 text-sm text-slate-300"><input name="consent" required type="checkbox" className="mt-1" />Согласен на обработку персональных данных.</label>
      <button disabled={status === 'loading'} className="rounded-xl bg-cyan-400 px-6 py-3 font-medium text-slate-950">{status === 'loading' ? 'Отправка...' : 'Отправить заявку'}</button>
      {status === 'success' && !redirectOnSuccess && <p className="text-sm text-emerald-300">Спасибо! Заявка отправлена.</p>}
      {status === 'error' && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}
