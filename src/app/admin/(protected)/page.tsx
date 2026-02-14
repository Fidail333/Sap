export const runtime = 'nodejs';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { getAdminContent } from '@/lib/cms';

export default async function AdminPage() {
  const [news, articles] = await Promise.all([getAdminContent('news'), getAdminContent('article')]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Content admin</h1>
        <form action="/api/admin/logout" method="post"><button type="submit" className="rounded-lg border border-white/20 px-3 py-2 text-sm">Выйти</button></form>
      </div>
      <AdminDashboard initialNews={news.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} initialArticles={articles.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} />
    </main>
  );
}
