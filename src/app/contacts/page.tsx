import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Контакты | Sapphire LED', 'Свяжитесь с Sapphire LED для подбора светодиодных модулей и расчета проекта.', '/contacts');

const address = 'г.Москва, вн.тер.г. Муниципальный Округ Можайский, ул Горбунова, д. 2, стр. 3, Помещ. 18/8';
const mapUrl = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(address)}&z=15`;

export default function ContactsPage({ searchParams }: { searchParams?: { product?: string } }) {
  const product = searchParams?.product?.trim();

  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Контакты</h1>

        {product ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            <span>Запрос по товару: {product}</span>
            <Link href="/products" className="rounded-lg border border-cyan-300/40 px-3 py-1.5 text-cyan-200 hover:bg-cyan-300/20">Перейти в каталог</Link>
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">Адрес</p>
              <p className="mt-2 text-slate-200">{address}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">Телефон</p>
              <a href="tel:+79031108467" className="mt-2 inline-flex text-lg font-medium text-cyan-300 hover:text-cyan-200">+7-903-110-84-67</a>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">Email</p>
              <a href="mailto:mail@led-modules.ru" className="mt-2 inline-flex text-lg text-cyan-300 hover:text-cyan-200">mail@led-modules.ru</a>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">Режим работы</p>
              <p className="mt-2 text-slate-200">Пн. – Пт.: с 9:00 до 18:00</p>
            </article>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-3 shadow-xl shadow-cyan-950/30">
            <iframe src={mapUrl} width="100%" height="420" loading="lazy" className="rounded-xl" title="Карта офиса Sapphire LED" />
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
            >
              Открыть в Яндекс.Картах
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
