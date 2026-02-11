import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('О компании | SAP LED Systems', 'Инженерная команда SAP LED Systems: проектирование, производство, поставка и сервис LED-решений.', '/about');

export default function AboutPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">О компании</h1>
        <p className="mt-4 max-w-3xl text-slate-300">SAP LED Systems — B2B-интегратор LED-экранов. С 2015 года реализуем проекты полного цикла: от технической концепции и 3D-моделирования до монтажа и SLA-сервиса.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-3xl font-semibold text-cyan-300">230+</p><p className="mt-2 text-sm text-slate-300">проектов в России и СНГ</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-3xl font-semibold text-cyan-300">18</p><p className="mt-2 text-sm text-slate-300">инженеров в проектной команде</p></article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-3xl font-semibold text-cyan-300">48ч</p><p className="mt-2 text-sm text-slate-300">максимальный SLA по сервису</p></article>
        </div>
      </Section>
    </main>
  );
}
