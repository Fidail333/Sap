import type { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Оставить заявку | SAP LED Systems', 'Форма заявки на подбор LED-экрана и расчет коммерческого предложения.', '/request');

export default function RequestPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Оставить заявку</h1>
        <p className="mt-3 text-slate-300">Опишите задачу — инженер подготовит конфигурацию, сроки и стоимость.</p>
        <div className="mt-8 max-w-3xl"><RequestForm redirectOnSuccess /></div>
      </Section>
    </main>
  );
}
