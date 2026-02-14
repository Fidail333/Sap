'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { Card } from '@/components/ui/Card';

type SolutionCategory = 'outdoor' | 'indoor' | 'stage';

type SolutionItem = {
  id: string;
  title: string;
  description: string;
  specs: string[];
  category: SolutionCategory;
  image: string;
  href?: string;
};

const filters: Array<{ label: string; value: 'all' | SolutionCategory }> = [
  { label: 'Все', value: 'all' },
  { label: 'Наружные', value: 'outdoor' },
  { label: 'Внутренние', value: 'indoor' },
  { label: 'Сценические', value: 'stage' }
];

const solutions: SolutionItem[] = [
  {
    id: 'facades',
    title: 'Рекламные фасады и билборды',
    description: 'Высокая яркость и устойчивость к внешней среде для стабильной видимости контента в городском потоке.',
    specs: ['Яркость до 7500 nit', 'Защита IP65', 'Шаг пикселя P4–P10'],
    category: 'outdoor',
    image: '/visuals/Рекламные фасады.jpg',
    href: '/resheniya/naruzhnaya-reklama'
  },
  {
    id: 'control',
    title: 'Информационные табло и диспетчерские',
    description: 'Надёжные indoor-панели для круглосуточной работы, визуального контроля и отображения критичных данных.',
    specs: ['24/7 режим работы', 'Бесшовная сборка', 'Цветовая калибровка'],
    category: 'indoor',
    image: '/visuals/Информационное табло.jpg',
    href: '/resheniya/dispetcherskie-tsentry'
  },
  {
    id: 'events',
    title: 'Сценические экраны и ивенты',
    description: 'Модульные сборки с удобным монтажом для концертных площадок, презентаций и событийных форматов.',
    specs: ['Быстрый монтаж/демонтаж', 'Частота обновления до 7680 Гц', 'Модульная конструкция'],
    category: 'stage',
    image: '/visuals/Сценические экраны.jpg',
    href: '/resheniya/stseny-i-meropriyatiya'
  },
  {
    id: 'sport',
    title: 'Спортивные объекты и арены',
    description: 'Контрастная картинка для трибун и арен, корректная читаемость и динамичный видеоконтент.',
    specs: ['Высокая контрастность', 'Угол обзора до 160°', 'Надёжная работа на улице'],
    category: 'outdoor',
    image: '/visuals/Спортивные объекты.jpg'
  },
  {
    id: 'retail',
    title: 'Ритейл и витрины',
    description: 'Fine-pitch решения для брендинга, товарных акцентов и эмоциональной подачи промо в торговых пространствах.',
    specs: ['Fine-pitch панели', 'Точная цветопередача', 'Низкий уровень шума'],
    category: 'indoor',
    image: '/visuals/витрины.jpg',
    href: '/resheniya/riteyl-i-vitriny'
  },
  {
    id: 'showroom',
    title: 'Корпоративные пространства и шоурумы',
    description: 'LED-системы для лобби, переговорных и демонстрационных зон с акцентом на стиль и детализацию.',
    specs: ['Бесшовные видеостены', 'Яркость 600–1200 nit', 'Интеграция с AV-системами'],
    category: 'indoor',
    image: '/visuals/корпоративные пространства.jpg'
  }
];

function SolutionsCard({ item }: { item: SolutionItem }) {
  const content = (
    <Card className="group relative flex h-full flex-col overflow-hidden border-cyan-200/20 bg-slate-900/70 p-0 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-300/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
      <div className="relative w-full overflow-hidden aspect-[16/9]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <h3 className="break-words text-lg font-semibold leading-tight">{item.title}</h3>
        <p className="break-words text-sm leading-relaxed text-slate-300">{item.description}</p>
        <ul className="mt-1 space-y-1.5 text-xs text-cyan-100/90 sm:text-sm">
          {item.specs.map((spec) => (
            <li key={spec} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
              <span>{spec}</span>
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex w-fit translate-y-1 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          Подробнее
        </span>
      </div>
    </Card>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}

export function SolutionsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | SolutionCategory>('all');

  const filteredSolutions = useMemo(
    () => solutions.filter((item) => activeFilter === 'all' || item.category === activeFilter),
    [activeFilter]
  );

  return (
    <>
      <Reveal>
        <h2 className="text-3xl font-semibold">Комплексные LED-решения для бизнеса</h2>
      </Reveal>

      <Reveal>
        <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                activeFilter === filter.value
                  ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.22)]'
                  : 'border-white/20 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:text-cyan-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-8 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredSolutions.map((item) => (
          <Reveal key={item.id} className="h-full">
            <SolutionsCard item={item} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
