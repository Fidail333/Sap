import type { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('О компании Sapphire LED', 'Sapphire LED — поставщик светодиодных модулей и комплектующих для экранов.', '/about');

const goals = [
  'Обеспечение клиентов высококачественными светодиодными модулями и комплектующими.',
  'Постоянное расширение ассортимента продукции и внедрение новых технологий.',
  'Развитие долгосрочных партнерских отношений с клиентами и поставщиками.',
  'Оперативная доставка и профессиональная поддержка на всех этапах сотрудничества.',
  'Содействие развитию рынка LED-технологий через образовательные инициативы и обмен опытом.'
];

export default function AboutPage() {
  return (
    <main>
      <Section className="pt-10 md:pt-14">
        <div className="rounded-3xl border border-cyan-200/20 bg-slate-900/60 p-5 sm:p-8 md:p-12">
          <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">О компании Sapphire LED</h1>
          <p className="mt-4 max-w-3xl text-slate-300">Sapphire LED — динамично развивающаяся компания, специализирующаяся на поставке высококачественных светодиодных модулей и комплектующих для экранов по всей стране.</p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">О компании</h2>
            <p className="mt-4 text-slate-300">Компания Sapphire LED — это динамично развивающаяся компания, специализирующаяся на поставке высококачественных светодиодных модулей и комплектующих для экранов. Мы работаем с клиентами по всей стране, предлагая надежные решения для создания ярких и эффективных LED-экранов. Наша продукция используется в рекламных щитах, информационных табло, сценических экранах и других проектах, где важны качество, надежность и долговечность.</p>
          </article>
          <Image src="/visuals/branding/led-grid.svg" alt="LED-сетка и модули Sapphire LED" width={800} height={500} className="rounded-2xl border border-white/10" />
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Image src="/visuals/branding/signal-lines.svg" alt="Сигнальные линии и технологические процессы" width={800} height={500} className="order-2 rounded-2xl border border-white/10 lg:order-1" />
          <article className="order-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:order-2">
            <h2 className="text-2xl font-semibold">Миссия</h2>
            <p className="mt-4 text-slate-300">Мы стремимся стать надежным партнером для наших клиентов, предоставляя инновационные и качественные решения в области светодиодных технологий для экранов.</p>
            <p className="mt-3 text-slate-300">Наша миссия — помогать бизнесу и организациям воплощать яркие, энергоэффективные и технологичные решения, которые вдохновляют и привлекают внимание.</p>
          </article>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Цели</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              {goals.map((goal) => (
                <li key={goal} className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3">• {goal}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Наш подход</h2>
            <p className="mt-4 text-slate-300">Sapphire LED — это команда профессионалов, которая ценит качество, инновации и индивидуальный подход к каждому клиенту.</p>
            <p className="mt-3 text-slate-300">Мы сопровождаем проекты на всех этапах: от консультации и подбора модулей до поставки, внедрения и поддержки после запуска.</p>
            <Image src="/visuals/branding/led-panel.svg" alt="Стилизованная LED-панель" width={800} height={500} className="mt-6 rounded-2xl border border-white/10" />
          </article>
        </div>
      </Section>
    </main>
  );
}
