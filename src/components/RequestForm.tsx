'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type RequestFormProps = {
  initialProductName?: string;
  initialProductId?: string;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  consent?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RequestForm({ initialProductName = '', initialProductId = '', onSuccess, redirectOnSuccess = false }: RequestFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState(initialProductName ? `Интересует: ${initialProductName}` : '');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const productContext = useMemo(() => initialProductName || '', [initialProductName]);

  function validateForm() {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = 'Введите имя.';
    if (!email.trim()) nextErrors.email = 'Введите email.';
    else if (!emailRegex.test(email)) nextErrors.email = 'Укажите корректный email.';
    if (!consent) nextErrors.consent = 'Необходимо согласие на обработку персональных данных.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    setError('');

    const formData = new FormData();
    formData.set('name', name.trim());
    formData.set('email', email.trim());
    formData.set('comment', comment.trim());
    if (productContext) formData.set('productName', productContext);
    if (initialProductId) formData.set('productId', initialProductId);
    formData.set('consent', consent ? 'on' : 'off');

    const response = await fetch('/api/request', { method: 'POST', body: formData });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || 'Не удалось отправить заявку. Попробуйте позже.');
      setStatus('error');
      return;
    }

    setStatus('success');
    onSuccess?.();
    if (redirectOnSuccess) router.push('/request/thanks');
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.6)]">
      {productContext && (
        <p className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          Товар: <span className="font-medium">{productContext}</span>
        </p>
      )}

      <div className="grid gap-4">
        <div>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            placeholder="Имя *"
            className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3"
          />
          {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            placeholder="Email *"
            className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3"
          />
          {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
        </div>

        <textarea
          name="comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Комментарий"
          className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3"
        />

        <div>
          <label className="flex items-start gap-2 text-sm text-slate-300">
            <input
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1"
            />
            <span>
              Согласен на обработку персональных данных (
              <Link href="/privacy" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                Политика
              </Link>
              )
            </span>
          </label>
          {errors.consent && <p className="mt-1 text-xs text-rose-300">{errors.consent}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-6 py-3 font-medium text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? 'Отправка...' : 'Связаться с инженером'}
      </button>

      {status === 'success' && !redirectOnSuccess && <p className="text-sm text-emerald-300">Спасибо! Мы свяжемся с вами в ближайшее время.</p>}
      {status === 'error' && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}
