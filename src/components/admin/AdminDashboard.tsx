import Image from 'next/image';
'use client';

import { useMemo, useState } from 'react';
import { toSlug } from '@/lib/slug';

type Kind = 'news' | 'article';
type ContentItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: string;
};

type ApiResult = { ok: boolean; error?: { code: string; message: string; details?: string } };

const emptyForm = { id: '', title: '', slug: '', description: '', content: '', image: '', published: false };

function Toast({ message, onClose, error }: { message: string; onClose: () => void; error?: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md rounded-xl border border-white/20 bg-slate-950/95 p-4 text-sm shadow-2xl">
      <p className="font-medium text-white">{message}</p>
      {error ? <p className="mt-2 text-xs text-slate-300">Подробнее: {error}</p> : null}
      <button onClick={onClose} className="mt-3 text-cyan-300">Закрыть</button>
    </div>
  );
}

export function AdminDashboard({ initialNews, initialArticles }: { initialNews: ContentItem[]; initialArticles: ContentItem[] }) {
  const [tab, setTab] = useState<Kind>('news');
  const [records, setRecords] = useState<Record<Kind, ContentItem[]>>({ news: initialNews, article: initialArticles });
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; details?: string } | null>(null);

  const items = useMemo(() => {
    return records[tab]
      .filter((item) => (filter === 'all' ? true : filter === 'published' ? item.published : !item.published))
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.slug.toLowerCase().includes(search.toLowerCase()));
  }, [records, tab, filter, search]);

  const onTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: isEditing && prev.slug ? prev.slug : toSlug(title) }));
  };

  const onSelectItem = (item: ContentItem) => {
    setIsEditing(true);
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description ?? '',
      content: item.content,
      image: item.image ?? '',
      published: item.published
    });
    setPreview(item.image);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setPreview(null);
  };

  const refreshKind = async () => {
    const response = await fetch(`/api/admin/content?kind=${tab}`);
    const data = await response.json();
    if (data.ok) setRecords((prev) => ({ ...prev, [tab]: data.data }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const response = await fetch('/api/admin/content', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: tab, ...form })
    });
    const data: ApiResult = await response.json();
    if (!data.ok) {
      setToast({ message: data.error?.message || 'Ошибка сохранения', details: data.error?.details });
      return;
    }
    await refreshKind();
    setToast({ message: isEditing ? 'Запись обновлена' : 'Запись создана' });
    if (!isEditing) resetForm();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Удалить запись?')) return;
    const response = await fetch('/api/admin/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: tab, id })
    });
    const data: ApiResult = await response.json();
    if (!data.ok) {
      setToast({ message: data.error?.message || 'Ошибка удаления', details: data.error?.details });
      return;
    }
    await refreshKind();
    if (form.id === id) resetForm();
  };

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    body.append('slug', form.slug || form.title || 'image');

    const response = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await response.json();
    if (!data.ok) {
      setToast({ message: data.error?.message || 'Ошибка загрузки', details: data.error?.details });
      return;
    }

    setForm((prev) => ({ ...prev, image: data.data.path }));
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[360px,1fr]">
      <aside className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
        <div className="flex gap-2">
          <button onClick={() => { setTab('news'); resetForm(); }} className={`rounded-lg px-3 py-2 ${tab === 'news' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800'}`}>Новости</button>
          <button onClick={() => { setTab('article'); resetForm(); }} className={`rounded-lg px-3 py-2 ${tab === 'article' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800'}`}>Материалы</button>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск" className="mt-3 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')} className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2">
          <option value="all">Все</option>
          <option value="published">Опубликованные</option>
          <option value="draft">Черновики</option>
        </select>
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <button key={item.id} onClick={() => onSelectItem(item)} className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-left hover:border-cyan-400/60">
              <p className="line-clamp-1 font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">/{item.slug} · {item.published ? 'published' : 'draft'}</p>
            </button>
          ))}
          {items.length === 0 ? <p className="text-sm text-slate-400">Нет записей по текущему фильтру.</p> : null}
        </div>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-[#020617] p-5">
        <h2 className="text-xl font-semibold">{isEditing ? 'Редактирование' : 'Новая запись'}</h2>
        <form onSubmit={submitForm} className="mt-4 grid gap-3">
          <input value={form.title} onChange={(e) => onTitleChange(e.target.value)} required placeholder="Заголовок" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))} required placeholder="slug" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} placeholder="Описание" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={8} placeholder="Контент" required className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />

          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <label className="text-sm text-slate-200">Изображение</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mt-2 block w-full text-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  setToast({ message: 'Размер файла должен быть до 5MB' });
                  return;
                }
                setPreview(URL.createObjectURL(file));
                await uploadImage(file);
              }}
            />
            <input value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="/visuals/uploads/..." className="mt-2 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
            {preview || form.image ? <Image src={preview || form.image} alt="preview" width={640} height={256} className="mt-3 h-32 w-full rounded-lg object-cover" unoptimized /> : null}
          </div>

          <label className="text-sm text-slate-300"><input type="checkbox" checked={form.published} onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))} className="mr-2" />Опубликовано</label>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-900">{isEditing ? 'Сохранить' : 'Создать'}</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 px-4 py-2">Очистить</button>
            {isEditing ? <button type="button" onClick={() => deleteItem(form.id)} className="rounded-lg border border-rose-500/40 px-4 py-2 text-rose-300">Удалить</button> : null}
          </div>
        </form>
      </section>
      {toast ? <Toast message={toast.message} error={toast.details} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
