'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Direction } from '@/lib/types';

interface RequestFormProps {
  initialDirection?: Direction;
  initialNeed?: string;
  compact?: boolean;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
}

export function RequestForm({
  initialDirection = 'SAPPHIRE',
  initialNeed = '',
  compact,
  onSuccess,
  redirectOnSuccess = false
}: RequestFormProps) {
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
    (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'request_submit' });
    onSuccess?.();
    if (redirectOnSuccess) router.push('/request/thanks');
  }

  return (
    <form
      action={submitAction}
      className={`grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 ${compact ? '' : 'shadow-sm'}`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required placeholder="Имя" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input name="phone" required placeholder="Телефон" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input name="email" required type="email" placeholder="Email" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input name="company" placeholder="Компания (необязательно)" className="rounded-xl border border-slate-300 px-4 py-3" />
      </div>
      <select name="direction" defaultValue={initialDirection} className="rounded-xl border border-slate-300 px-4 py-3">
        <option value="SAPPHIRE">SAPPHIRE</option>
        <option value="MODULES">MODULES</option>
      </select>
      <textarea name="need" defaultValue={initialNeed} rows={4} placeholder="Что нужно" className="rounded-xl border border-slate-300 px-4 py-3" />
      <input name="file" type="file" className="rounded-xl border border-slate-300 px-4 py-2" />
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input name="consent" required type="checkbox" className="mt-1" />
        Согласен на обработку персональных данных.
      </label>
      <button disabled={status === 'loading'} className="rounded-xl bg-primary px-6 py-3 font-medium text-white">
        {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
      </button>
      {status === 'success' && !redirectOnSuccess && <p className="text-sm text-emerald-600">Спасибо! Заявка отправлена.</p>}
      {status === 'error' && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  );
}
