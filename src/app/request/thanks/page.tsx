import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata(
  'Заявка отправлена | Sapphire LED',
  'Подтверждение отправки заявки в Sapphire LED. Наш инженер свяжется с вами в рабочее время.',
  '/request/thanks'
);

export default function ThanksPage() {
  return (
    <main>
      <Section className="text-center">
        <h1 className="text-4xl font-semibold">Спасибо!</h1>
        <p className="mt-3 text-slate-300">Мы получили заявку и свяжемся с вами в течение рабочего дня.</p>
        <Link href="/catalog" className="mt-6 inline-block text-cyan-300">Вернуться в каталог</Link>
      </Section>
    </main>
  );
}
