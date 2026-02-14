'use client';

import Image from 'next/image';
import { useState } from 'react';
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

const emptyForm = { title: '', slug: '', description: '', content: '', image: '', published: true };

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
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; details?: string } | null>(null);

  const onTitleChange = (title: string) => {
    setForm((prev) => ({ ...prev, title, slug: prev.slug ? prev.slug : toSlug(title) }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setPreview(null);
  };

  const refreshKind = async () => {
    const response = await fetch(`/api/admin/content?kind=${tab}`);
    const data = await response.json();
    if (data.ok) setRecords((prev) => ({ ...prev, [tab]: data.data }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: tab, ...form })
    });

    const data: ApiResult = await response.json();
    if (!data.ok) {
      setToast({ message: data.error?.message || 'Ошибка сохранения', details: data.error?.details });
      return;
    }

    await refreshKind();
    resetForm();
    setToast({ message: 'Запись создана' });
  };

  const bootstrapContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/content/bootstrap', { method: 'POST' });
      const data = await response.json();
      if (!data.ok) {
        setToast({ message: data.error?.message || 'Не удалось добавить демо-контент', details: data.error?.details });
        return;
      }
      setRecords((prev) => ({ news: data.data.news, article: data.data.article }));
      setToast({ message: 'Добавлено 6 записей с изображениями' });
    } finally {
      setLoading(false);
    }
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
    <div className="mt-6 grid gap-6 lg:grid-cols-[380px,1fr]">
      <aside className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
        <h2 className="text-lg font-semibold">Раздел</h2>
        <div className="mt-3 flex gap-2">
          <button onClick={() => { setTab('news'); resetForm(); }} className={`rounded-lg px-3 py-2 ${tab === 'news' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800'}`}>Новости</button>
          <button onClick={() => { setTab('article'); resetForm(); }} className={`rounded-lg px-3 py-2 ${tab === 'article' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800'}`}>Статьи</button>
        </div>
        <button
          type="button"
          onClick={bootstrapContent}
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-sm text-cyan-200 disabled:opacity-60"
        >
          {loading ? 'Добавляем...' : 'Сгенерировать 6 демо-материалов'}
        </button>

        <div className="mt-5 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Последние записи</p>
          {records[tab].slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
              <p className="line-clamp-1 font-medium">{item.title}</p>
              <p className="text-xs text-slate-400">/{item.slug}</p>
            </div>
          ))}
          {records[tab].length === 0 ? <p className="text-sm text-slate-400">Пока нет записей.</p> : null}
        </div>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-[#020617] p-5">
        <h2 className="text-xl font-semibold">Новая {tab === 'news' ? 'новость' : 'статья'}</h2>
        <p className="mt-1 text-sm text-slate-400">В админке оставлена только функция добавления материалов в базу данных.</p>
        <form onSubmit={submitForm} className="mt-4 grid gap-3">
          <input value={form.title} onChange={(e) => onTitleChange(e.target.value)} required placeholder="Заголовок" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <input value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))} required placeholder="slug" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} placeholder="Краткое описание" className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />
          <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={8} placeholder="Текст материала" required className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" />

          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <label className="text-sm text-slate-200">Фотография с компьютера</label>
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

          <label className="text-sm text-slate-300"><input type="checkbox" checked={form.published} onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))} className="mr-2" />Опубликовать сразу</label>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-900">Добавить</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 px-4 py-2">Очистить</button>
          </div>
        </form>
      </section>
      {toast ? <Toast message={toast.message} error={toast.details} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
