import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { DatabaseHealthBanner } from '@/components/admin/DatabaseHealthBanner';
import { createContentAction, deleteContentAction, updateContentAction, updateLeadStatusAction } from '@/app/admin/(protected)/actions';
import { getAdminContent, getLeads } from '@/lib/cms';

type ContentType = 'news' | 'article' | 'product';
type ContentItem = { id: string; title: string; slug: string; description: string; content: string; image: string; published: boolean };

function ContentBlock({ kind, title, items }: { kind: ContentType; title: string; items: ContentItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <form action={createContentAction} className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <input type="hidden" name="kind" value={kind} />
        <input required name="title" placeholder="Заголовок" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <input required name="slug" placeholder="slug" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <input required name="image" placeholder="URL изображения" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <textarea required name="description" rows={2} placeholder="Краткое описание" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <textarea required name="content" rows={4} placeholder="Полный контент" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <label className="text-sm text-slate-300"><input name="published" type="checkbox" className="mr-2" />Опубликовать сразу</label>
        <button type="submit" className="rounded-lg bg-cyan-500 px-3 py-2 font-medium text-slate-900">Добавить</button>
      </form>

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <form action={updateContentAction} className="grid gap-2">
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="id" value={item.id} />
              <input required name="title" defaultValue={item.title} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
              <input required name="slug" defaultValue={item.slug} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
              <input required name="image" defaultValue={item.image} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
              <textarea required name="description" rows={2} defaultValue={item.description} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
              <textarea required name="content" rows={4} defaultValue={item.content} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
              <label className="text-sm text-slate-300"><input name="published" type="checkbox" defaultChecked={item.published} className="mr-2" />Опубликовано</label>
              <button type="submit" className="w-fit rounded-lg border border-cyan-400/40 px-3 py-2 text-sm text-cyan-300">Сохранить</button>
            </form>
            <form action={deleteContentAction} className="mt-2">
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="id" value={item.id} />
              <ConfirmButton text="Удалить" confirmText="Удалить запись?" />
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminPage({ searchParams }: { searchParams?: { error?: string } }) {
  const [news, articles, products, leads] = await Promise.all([getAdminContent('news'), getAdminContent('article'), getAdminContent('product'), getLeads()]);
  const errorMessage = searchParams?.error || '';

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Admin panel</h1>
        <form action="/api/admin/logout" method="post"><button type="submit" className="rounded-lg border border-white/20 px-3 py-2 text-sm">Выйти</button></form>
      </div>
      {errorMessage ? <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">Ошибка: {errorMessage}</p> : null}
      <DatabaseHealthBanner />
      <ContentBlock kind="news" title="Новости" items={news as ContentItem[]} />
      <ContentBlock kind="article" title="Статьи" items={articles as ContentItem[]} />
      <ContentBlock kind="product" title="Товары" items={products as ContentItem[]} />

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Заявки (Leads)</h2>
        <div className="mt-4 space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-medium">{lead.name} · {lead.contact}</p>
              <p className="mt-1 text-sm text-slate-300">{lead.message}</p>
              <p className="mt-1 text-xs text-slate-400">Источник: {lead.source} · {new Date(lead.createdAt).toLocaleString('ru-RU')}</p>
              <form action={updateLeadStatusAction} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <select name="status" defaultValue={lead.status} className="rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm">
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>
                <button type="submit" className="rounded-lg border border-cyan-400/40 px-3 py-2 text-sm text-cyan-300">Обновить</button>
              </form>
            </div>
          ))}
          {leads.length === 0 ? <p className="text-sm text-slate-400">Заявок пока нет.</p> : null}
        </div>
      </section>
    </main>
  );
}
