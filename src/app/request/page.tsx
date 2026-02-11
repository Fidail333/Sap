import type { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Оставить заявку | SAP LED', 'Форма заявки для подбора решений и комплектующих.', '/request');

export default function RequestPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Оставить заявку</h1>
      <p className="mt-3 text-slate-600">Заполните форму, и мы свяжемся с вами для уточнения деталей.</p>
      <div className="mt-8">
        <RequestForm redirectOnSuccess />
      </div>
    </main>
  );
}
