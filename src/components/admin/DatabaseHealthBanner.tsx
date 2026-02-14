'use client';

import { useEffect, useState } from 'react';

type HealthState = {
  loading: boolean;
  ok: boolean;
  error: string;
};

export function DatabaseHealthBanner() {
  const [state, setState] = useState<HealthState>({ loading: true, ok: true, error: '' });

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const response = await fetch('/api/health/db', { cache: 'no-store' });
        const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

        if (!isMounted) return;

        if (response.ok && data.ok) {
          setState({ loading: false, ok: true, error: '' });
          return;
        }

        setState({
          loading: false,
          ok: false,
          error: data.error || 'База не подключена. Проверь DATABASE_URL в Vercel и сделай Redeploy.'
        });
      } catch {
        if (!isMounted) return;
        setState({
          loading: false,
          ok: false,
          error: 'База не подключена. Проверь DATABASE_URL в Vercel и сделай Redeploy.'
        });
      }
    }

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state.loading || state.ok) {
    return null;
  }

  return (
    <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
      {state.error === 'DATABASE_URL is missing'
        ? 'База не подключена. Проверь DATABASE_URL в Vercel и сделай Redeploy.'
        : state.error}
    </p>
  );
}
