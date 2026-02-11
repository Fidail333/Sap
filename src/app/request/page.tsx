import type { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Связаться с инженером | Sapphire LED', 'Форма связи с инженером Sapphire LED.', '/request');

export default function RequestPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Связаться с инженером</h1>
        <p className="mt-3 text-slate-300">Оставьте контакты — инженер уточнит параметры и предложит решение.</p>
        <div className="mt-8 max-w-3xl"><RequestForm redirectOnSuccess /></div>
      </Section>
    </main>
  );
}
