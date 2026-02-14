'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type WorkProcessIcon = 'brief' | 'calculation' | 'production' | 'service';

export type WorkStep = {
  id: string;
  number: '01' | '02' | '03' | '04';
  title: string;
  desc: string;
  time: string;
  details: string[];
  icon: WorkProcessIcon;
};

const defaultSteps: WorkStep[] = [
  {
    id: 'brief-audit',
    number: '01',
    title: 'Бриф и аудит площадки',
    desc: 'Фиксируем задачи бизнеса, оцениваем локацию и условия эксплуатации. Формируем понятный технический бриф.',
    time: '1–2 дня',
    details: ['Выезд/онлайн-аудит объекта', 'Сбор требований по контенту и режиму работы', 'Подготовка технического задания'],
    icon: 'brief'
  },
  {
    id: 'calculation-selection',
    number: '02',
    title: 'Расчёт и подбор решения',
    desc: 'Подбираем серию, шаг пикселя и конфигурацию под бюджет. Согласовываем финальный пилотный расчёт.',
    time: '1 день',
    details: ['Сравнение 2–3 конфигураций', 'Расчёт энергопотребления и комплектующих', 'Финальная смета и сроки'],
    icon: 'calculation'
  },
  {
    id: 'production-logistics',
    number: '03',
    title: 'Производство и логистика',
    desc: 'Комплектуем проект, проверяем совместимость и организуем поставку. Перед отгрузкой выполняем калибровку.',
    time: '7–21 день',
    details: ['Контроль качества на этапе сборки', 'Калибровка модулей и тестирование', 'План поставки с прозрачными этапами'],
    icon: 'production'
  },
  {
    id: 'installation-service',
    number: '04',
    title: 'Монтаж, запуск и сервис',
    desc: 'Проводим монтаж, настраиваем систему управления и обучаем команду. Остаёмся на связи после запуска.',
    time: '1–3 дня',
    details: ['Пусконаладка и тестовые сценарии', 'Инструктаж персонала заказчика', 'Регламент сервисной поддержки'],
    icon: 'service'
  }
];

function WorkIcon({ type }: { type: WorkProcessIcon }) {
  const common = 'h-5 w-5 text-cyan-300 transition-colors duration-300 group-hover:text-cyan-100';

  if (type === 'brief') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 4.75h7l3.25 3.25V19.25H7V4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 4.75V8h3.25" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9.5 11.25h5M9.5 14.25h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'calculation') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5.5" y="4.75" width="13" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h6M9 12.25h1.25M11.75 12.25H13M14.5 12.25h1.25M9 15.5h1.25M11.75 15.5H13M14.5 15.5h1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'production') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.75 9.25L12 4.75L20.25 9.25V18.75H3.75V9.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 12.25h8M8 15.25h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5.5C8.41 5.5 5.5 8.41 5.5 12C5.5 15.59 8.41 18.5 12 18.5C15.59 18.5 18.5 15.59 18.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 8.5V12L14.75 13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 6.25H19.25V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkProcess({ steps = defaultSteps }: { steps?: WorkStep[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const regionId = useId();

  return (
    <div>
      <h2 className="text-3xl font-semibold">Процесс работы</h2>

      <div className="relative mt-6 md:mt-8">
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-300/0 via-cyan-300/50 to-cyan-300/0 md:hidden" />
        <span aria-hidden="true" className="pointer-events-none absolute left-10 right-10 top-[2.1rem] hidden h-px bg-gradient-to-r from-cyan-300/0 via-cyan-300/50 to-cyan-300/0 md:block" />

        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-4">
          {steps.map((step) => {
            const isExpanded = expandedId === step.id;
            const detailsId = `${regionId}-${step.id}`;

            return (
              <article
                key={step.id}
                className={cn(
                  'group relative ml-7 rounded-2xl border border-cyan-200/15 bg-slate-950/65 p-5 backdrop-blur transition-all duration-300 md:ml-0 md:p-6',
                  'hover:-translate-y-1 hover:border-cyan-200/40 hover:shadow-[0_0_32px_rgba(34,211,238,0.16)]',
                  isExpanded && 'border-cyan-200/45 bg-slate-900/80 shadow-[0_0_36px_rgba(34,211,238,0.2)]'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={cn('text-2xl font-semibold tracking-wide text-cyan-300 transition-colors duration-300 group-hover:text-cyan-100', isExpanded && 'text-cyan-100')}>
                      {step.number}
                    </span>
                    <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-2">
                      <WorkIcon type={step.icon} />
                    </div>
                  </div>
                  <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
                    {step.time}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-tight text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.desc}</p>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/5 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                    onClick={() => setExpandedId(isExpanded ? null : step.id)}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                  >
                    {isExpanded ? 'Скрыть детали' : 'Подробнее'}
                  </button>
                </div>

                <div
                  id={detailsId}
                  className={cn('grid transition-all duration-300 ease-out', isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-2 text-sm text-slate-200">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Button href="/contacts" className="mt-4 w-full sm:w-auto">
                      Получить расчёт
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-200/20 bg-gradient-to-r from-slate-900/75 via-slate-900/60 to-cyan-900/30 p-6 backdrop-blur md:mt-10 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="text-lg font-semibold text-white">Готовим предварительный расчёт в день обращения.</p>
          <p className="mt-1 text-sm text-slate-300">Покажем оптимальные конфигурации, сроки и бюджет без лишних итераций.</p>
        </div>
        <Button href="/contacts" className="mt-4 md:mt-0">
          Получить расчёт за 30 минут
        </Button>
      </div>
    </div>
  );
}
