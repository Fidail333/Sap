import type { Metadata } from 'next';
import Image from 'next/image';
import { CatalogCard } from '@/components/CatalogCard';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { productsData } from '@/lib/content';
import { blogPosts } from '@/data/blog';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Премиальные LED-решения для бизнеса | Sapphire LED', 'LED-экраны для indoor, outdoor, rental и control rooms с инженерным сопровождением и сервисом.', '/');

const solutions = [
  {
    title: 'Рекламные фасады и билборды',
    text: 'Высокая яркость и устойчивость к внешней среде для стабильной видимости контента в городском потоке.',
    image: '/visuals/solutions/outdoor-facades.svg'
  },
  {
    title: 'Информационные табло и диспетчерские',
    text: 'Надёжные indoor-панели для круглосуточной работы, визуального контроля и отображения критичных данных.',
    image: '/visuals/solutions/dispatch-boards.svg'
  },
  {
    title: 'Сценические экраны и ивенты',
    text: 'Модульные сборки с удобным монтажом для концертных площадок, презентаций и событийных форматов.',
    image: '/visuals/solutions/stage-events.svg'
  },
  {
    title: 'Спортивные объекты и арены',
    text: 'Контрастная картинка для трибун и арен, корректная читаемость и динамичный видеоконтент.',
    image: '/visuals/solutions/sports-arenas.svg'
  },
  {
    title: 'Ритейл и витрины',
    text: 'Fine-pitch решения для брендинга, товарных акцентов и эмоциональной подачи промо в торговых пространствах.',
    image: '/visuals/solutions/retail-showcases.svg'
  },
  {
    title: 'Корпоративные пространства и шоурумы',
    text: 'LED-системы для лобби, переговорных и демонстрационных зон с акцентом на стиль и детализацию.',
    image: '/visuals/solutions/corporate-showrooms.svg'
  }
];

const advantages = [
  { title: 'Подбор шага пикселя под задачу', text: 'Согласовываем плотность пикселя под дистанцию просмотра, контент и размер экрана, чтобы избежать переплаты.', icon: 'P' },
  { title: 'Технологии COB/GOB для защиты и детализации', text: 'Подбираем платформу модуля в зависимости от сценария эксплуатации и требований к визуальному качеству.', icon: 'C' },
  { title: '3840 Hz для камер и трансляций', text: 'Решения с повышенной частотой обновления помогают убрать мерцание в кадре и улучшают съёмку контента.', icon: 'Hz' },
  { title: 'Комплектация и совместимость', text: 'Проверяем базовую совместимость модулей, питания и управляющей части ещё до поставки.', icon: '✓' },
  { title: 'Инженерная поддержка и консультации', text: 'Помогаем на этапе расчёта, выбора серии и технических вопросов запуска системы.', icon: 'i' },
  { title: 'Склад, логистика и оперативная отгрузка', text: 'Держим в фокусе актуальные складские позиции, чтобы ускорять комплектацию типовых конфигураций.', icon: 'S' }
];

const process = ['Бриф и аудит площадки', 'Подбор серии и пилотный расчет', 'Производство, поставка, калибровка', 'Монтаж, запуск и сервис'];

const faq = [
  ['Как выбрать шаг пикселя для проекта?', 'Ориентируйтесь на минимальную дистанцию просмотра, тип контента и размер экрана. Для близкой дистанции обычно выбирают более плотный шаг, для крупных фасадных поверхностей — более крупный, но с достаточной яркостью.'],
  ['Чем отличаются indoor и outdoor решения?', 'Indoor-модули рассчитаны на контролируемую среду и близкий просмотр, тогда как outdoor-решения имеют усиленную защиту и повышенную яркость для улицы. При выборе учитываются климат, свет и сценарий эксплуатации.'],
  ['В чём разница COB и GOB?', 'COB даёт высокую однородность и детализацию для fine-pitch задач. GOB добавляет защитный слой и часто применяется в сценариях, где важна повышенная стойкость к внешним воздействиям.'],
  ['Что даёт частота 3840 Hz?', 'Повышенная частота обновления снижает заметность мерцания на камере и делает изображение стабильнее в видеосъёмке и трансляциях. Это особенно важно для событийных и студийных форматов.'],
  ['Где применяются гибкие LED-модули?', 'Гибкие модули используют для колонн, радиусных поверхностей и нестандартных интерьерных форм. Они помогают реализовать сложную геометрию без разрыва визуального рисунка.'],
  ['Как посчитать размер экрана?', 'Обычно исходят из архитектуры площадки, зоны видимости и целевого контента. На практике формируют несколько вариантов размеров и шага пикселя, затем выбирают оптимальный по задачам и бюджету.'],
  ['Что важно учесть по питанию и контроллерам?', 'Нужны корректный запас по мощности, понятная схема коммутации и совместимость управляющей части с выбранными модулями. Эти параметры лучше проверять до закупки оборудования.'],
  ['Как организуется гарантия и сервис?', 'Поддержка включает диагностику, рекомендации по обслуживанию и сопровождение по сервисным вопросам в рамках условий поставки. Формат сервиса уточняется под специфику проекта.'],
  ['Есть ли доставка и самовывоз?', 'Доступны варианты отгрузки под логистику заказчика, включая самовывоз со склада. Формат передачи согласуется на этапе комплектации и подготовки документов.'],
  ['Можно ли масштабировать экран после запуска?', 'Да, при корректно заложенной архитектуре систему можно расширять секциями. Важно заранее предусмотреть резерв по питанию и управлению, чтобы масштабирование прошло без перестройки узлов.']
];

const recentCases = [
  {
    title: 'Ритейл-пространство с медиастеной',
    industry: 'Ритейл',
    result: 'Собрана indoor-система для промо и навигации с акцентом на детализацию витринного контента.',
    image: '/visuals/cases/case-retail.svg'
  },
  {
    title: 'Сценический экран для event-площадки',
    industry: 'События',
    result: 'Модульная конфигурация для динамичного контента и стабильной работы во время программы.',
    image: '/visuals/cases/case-stage.svg'
  },
  {
    title: 'Уличный LED-фасад для коммерческого объекта',
    industry: 'Outdoor',
    result: 'Реализован яркий фасадный экран, рассчитанный на интенсивный городской поток и внешние условия.',
    image: '/visuals/cases/case-outdoor.svg'
  },
  {
    title: 'Информационное табло в диспетчерской зоне',
    industry: 'Инфраструктура',
    result: 'Настроена рабочая панель для визуализации данных и постоянного мониторинга.',
    image: '/visuals/cases/case-control.svg'
  }
];

function AdvantageIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-sm font-semibold text-cyan-200" aria-hidden="true">
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <Section className="pt-12 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Badge>Premium LED integrator</Badge>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">Инженерные LED-экраны для брендов, инфраструктуры и корпоративных пространств.</h1>
            <p className="mt-4 max-w-xl text-slate-300">Проектируем, поставляем и сопровождаем LED-системы полного цикла: от концепции и контента до монтажа и сервисной поддержки.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/products">Подобрать экран</Button>
              <Button href="/contacts">Получить коммерческое предложение</Button>
            </div>
          </Reveal>
          <Reveal>
            <div className="scanline relative min-h-[440px] overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-900/70 sm:min-h-[500px] md:min-h-[420px]">
              <Image src="/visuals/photo_2026-02-11_17-22-55.jpg" alt="Фоновое изображение LED-экрана" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/35 to-cyan-900/20" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="solutions">
        <Reveal><h2 className="text-3xl font-semibold">Решения</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((item) => (
            <Reveal key={item.title}>
              <Card className="flex min-h-[340px] flex-col overflow-hidden p-0">
                <div className="relative h-44 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                  <h3 className="break-words text-lg font-semibold leading-tight">{item.title}</h3>
                  <p className="line-clamp-3 break-words text-sm leading-relaxed text-slate-300">{item.text}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Преимущества</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <Reveal key={item.title}>
              <Card>
                <AdvantageIcon label={item.icon} />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6"><Reveal><h2 className="text-3xl font-semibold">Популярные серии</h2></Reveal><Button href="/products" variant="secondary">Весь каталог</Button></div>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">{productsData.slice(0, 6).map((item) => <Reveal key={item.id}><CatalogCard item={item} /></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Процесс работы</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-4">{process.map((item, index) => <Reveal key={item}><Card><p className="text-cyan-300">0{index + 1}</p><p className="mt-2 text-sm text-slate-300">{item}</p></Card></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">FAQ</h2></Reveal>
        <div className="mt-6 space-y-3 md:mt-8">{faq.map(([q, a]) => <Reveal key={q}><details className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm leading-relaxed text-slate-300">{a}</p></details></Reveal>)}</div>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6">
          <Reveal><h2 className="text-3xl font-semibold">Новости и статьи</h2></Reveal>
          <Button href="/blog" variant="secondary">Все материалы</Button>
        </div>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.slice(0, 6).map((item) => (
            <Reveal key={item.slug}>
              <Card className="flex min-h-[340px] flex-col overflow-hidden p-0">
                <div className="relative h-40 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                  <p className="text-xs text-cyan-300">{item.type}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.excerpt}</p>
                  <Button href={`/blog/${item.slug}`} variant="secondary" className="mt-4">Читать</Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Недавние кейсы</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-4">
          {recentCases.map((item) => (
            <Reveal key={item.title}>
              <Card className="flex min-h-[340px] flex-col overflow-hidden p-0">
                <div className="relative h-36 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-cyan-300">{item.industry}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.result}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}
