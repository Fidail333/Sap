import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Контакты | SAP LED Systems', 'Свяжитесь с SAP LED Systems для подбора и расчета LED-решений.', '/contacts');

const mapUrl = process.env.NEXT_PUBLIC_YMAPS_IFRAME_URL;

export default function ContactsPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Контакты</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-3 text-slate-300">
            <p><span className="text-slate-400">Телефон:</span> +7 (495) 145-88-40</p>
            <p><span className="text-slate-400">Email:</span> sales@sap-led.ru</p>
            <p><span className="text-slate-400">Адрес:</span> Москва, Ленинградский пр-т, 37к3, БЦ «Аэродом»</p>
            <p><span className="text-slate-400">График:</span> Пн–Пт 9:00–18:00</p>
          </div>
          {mapUrl ? (
            <iframe src={mapUrl} width="100%" height="380" loading="lazy" className="rounded-2xl border border-white/10" title="Карта офиса SAP LED Systems" />
          ) : (
            <div className="flex h-[380px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] text-center text-slate-400">Карта будет здесь<br />Задайте NEXT_PUBLIC_YMAPS_IFRAME_URL в ENV</div>
          )}
        </div>
      </Section>
    </main>
  );
}
