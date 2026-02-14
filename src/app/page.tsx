import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CatalogCard } from '@/components/CatalogCard';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { productsData } from '@/lib/content';
import { getPublishedBlogEntries } from '@/lib/cms';
import { buildMetadata, faqSchema } from '@/lib/seo';
import { PartnersMarquee } from '@/components/sections/PartnersMarquee';

export const metadata: Metadata = buildMetadata('Премиальные LED-решения для бизнеса | Sapphire LED', 'LED-экраны для indoor, outdoor, rental и control rooms с инженерным сопровождением и сервисом.', '/');

const solutions = [
  {
    title: 'Рекламные фасады и билборды',
    text: 'Высокая яркость и устойчивость к внешней среде для стабильной видимости контента в городском потоке.',
    image: '/visuals/Рекламные фасады.jpg'
  },
  {
    title: 'Информационные табло и диспетчерские',
    text: 'Надёжные indoor-панели для круглосуточной работы, визуального контроля и отображения критичных данных.',
    image: '/visuals/Информационное табло.jpg'
  },
  {
    title: 'Сценические экраны и ивенты',
    text: 'Модульные сборки с удобным монтажом для концертных площадок, презентаций и событийных форматов.',
    image: '/visuals/Сценические экраны.jpg'
  },
  {
    title: 'Спортивные объекты и арены',
    text: 'Контрастная картинка для трибун и арен, корректная читаемость и динамичный видеоконтент.',
    image: '/visuals/Спортивные объекты.jpg'
  },
  {
    title: 'Ритейл и витрины',
    text: 'Fine-pitch решения для брендинга, товарных акцентов и эмоциональной подачи промо в торговых пространствах.',
    image: '/visuals/витрины.jpg'
  },
  {
    title: 'Корпоративные пространства и шоурумы',
    text: 'LED-системы для лобби, переговорных и демонстрационных зон с акцентом на стиль и детализацию.',
    image: '/visuals/корпоративные пространства.jpg'
  }
];

const advantages = [
  {
    title: 'Подбор шага пикселя под задачу',
    text: 'Подбираем шаг пикселя под дистанцию и контент — без переплаты и без потери детализации.',
    icon: 'grid',
    tag: 'Точный расчет',
    cta: 'Подобрать модуль',
    href: '/catalog'
  },
  {
    title: 'Технологии COB/GOB для защиты и детализации',
    text: 'COB/GOB усиливают защиту поверхности — меньше повреждений и выше ресурс экрана.',
    icon: 'shield',
    tag: 'Повышенная защита',
    cta: 'Сравнить технологии',
    href: '/led-ekrany'
  },
  {
    title: '3840 Hz для камер и трансляций',
    text: '3840 Hz снижает мерцание в кадре — стабильная картинка для съёмки и эфира.',
    icon: 'wave',
    tag: 'Broadcast-ready',
    cta: 'Для трансляций',
    href: '/resheniya'
  },
  {
    title: 'Комплектация и совместимость',
    text: 'Проверяем совместимость модулей, питания и управления заранее — без задержек на запуске.',
    icon: 'checklist',
    tag: 'Без рисков',
    cta: 'Проверить совместимость',
    href: '/contacts'
  },
  {
    title: 'Инженерная поддержка и консультации',
    text: 'Сопровождаем от расчёта до старта — решение быстрее проходит путь до рабочего состояния.',
    icon: 'headset',
    tag: 'Экспертная команда',
    cta: 'Задать вопрос инженеру',
    href: '/contacts'
  },
  {
    title: 'Склад, логистика и оперативная отгрузка',
    text: 'Координируем склад и логистику — сокращаем сроки поставки типовых конфигураций.',
    icon: 'truck',
    tag: 'Быстрая отгрузка',
    cta: 'Уточнить сроки',
    href: '/contacts'
  }
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


function AdvantageIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    grid: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z" />
        <path d="M9.5 11.8l1.7 1.7 3.3-3.3" />
      </svg>
    ),
    wave: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="M8 12h4M6 9h2M6 15h2M19 8v8M22 10v4" />
      </svg>
    ),
    checklist: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M14 4h6v16H4V4h6" />
        <path d="M9 4h6v3H9zM8 12l1.5 1.5L12 11M8 17l1.5 1.5L12 16M14 12h4M14 17h4" />
      </svg>
    ),
    headset: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 13a8 8 0 0116 0" />
        <rect x="3" y="12" width="4" height="7" rx="1" />
        <rect x="17" y="12" width="4" height="7" rx="1" />
        <path d="M17 20a3 3 0 01-3 3h-2" />
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    )
  };

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 transition-transform duration-300 group-hover:scale-[1.02]" aria-hidden="true">
      {icons[type]}
    </span>
  );
}

export default async function Home() {
  const blogPosts = await getPublishedBlogEntries();

  return (
    <main>
      <JsonLd data={faqSchema(faq.map(([question, answer]) => ({ question, answer })))} />
      <Section className="pt-12 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Badge>Premium LED integrator</Badge>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">Инженерные LED-экраны для бизнеса, рекламы и корпоративных пространств</h1>
            <p className="mt-4 max-w-xl text-slate-300">Проектируем, поставляем и сопровождаем LED-системы полного цикла: от концепции и контента до монтажа и сервисной поддержки.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/catalog">Подобрать экран</Button>
              <Button href="/contacts">Получить коммерческое предложение</Button>
            </div>
          </Reveal>
          <Reveal>
            <div className="scanline relative min-h-[440px] overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-900/70 sm:min-h-[500px] md:min-h-[420px]">
              <Image src="/visuals/photo_2026-02-11_17-22-55.jpg" alt="Уличный рекламный LED-экран большого формата на фасаде здания" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/35 to-cyan-900/20" />
            </div>
          </Reveal>
        </div>
      </Section>

      <PartnersMarquee />

      <Section id="solutions">
        <Reveal><h2 className="text-3xl font-semibold">Решения</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((item) => (
            <Reveal key={item.title}>
              <Card className="flex min-h-[340px] flex-col overflow-hidden p-0">
                <div className="relative h-44 w-full">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
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
        <div className="mt-6 grid items-stretch gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => (
            <Reveal key={item.title} className="h-full">
              <Card className="group flex h-full flex-col border-cyan-200/20 bg-slate-900/70 transition duration-300 hover:border-cyan-300/40 hover:bg-slate-900/85 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <AdvantageIcon type={item.icon} />
                  <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">{item.tag}</span>
                </div>
                <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-tight">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{item.text}</p>
                <Link href={item.href} className="mt-auto inline-flex pt-4 text-sm font-medium text-cyan-200 decoration-cyan-300/70 underline-offset-4 transition hover:text-cyan-100 hover:underline group-hover:underline">
                  {item.cta}
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left"><Reveal><h2 className="text-3xl font-semibold">Популярные серии</h2></Reveal><Button href="/catalog" variant="secondary" className="self-center">Весь каталог</Button></div>
        <div className="mt-6 grid items-stretch gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">{productsData.slice(0, 6).map((item) => <Reveal key={item.id} className="h-full"><CatalogCard item={item} /></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Процесс работы</h2></Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-4">{process.map((item, index) => <Reveal key={item}><Card><p className="text-cyan-300">0{index + 1}</p><p className="mt-2 text-sm text-slate-300">{item}</p></Card></Reveal>)}</div>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <Reveal><h2 className="text-3xl font-semibold">Популярные направления</h2></Reveal>
          <Button href="/led-ekrany" variant="secondary" className="self-center">Все направления</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              href: '/led-ekrany',
              label: 'LED-экраны',
              description: 'Инженерный подбор LED-экранов под задачу: формат, шаг пикселя, яркость, условия эксплуатации и бюджет проекта.'
            },
            {
              href: '/ulichnye-led-ekrany',
              label: 'Уличные LED-экраны',
              description: 'Решения для городской среды: фасады, витрины и архитектурные поверхности с акцентом на дизайн и комфортную дистанцию просмотра.'
            },
            {
              href: '/reklamnye-led-ekrany',
              label: 'Рекламные LED-экраны',
              description: 'Digital-экраны для рекламы и промо-контента с высокой заметностью, гибким управлением и стабильной работой 24/7.'
            },
            {
              href: '/bolshie-led-ekrany',
              label: 'Большие LED-экраны',
              description: 'Крупноформатные экраны и видеостены для арен, сцен и массовых мероприятий, где важны масштаб и равномерность изображения.'
            },
            {
              href: '/indoor-led-ekrany',
              label: 'LED-экраны для помещений',
              description: 'Indoor и fine-pitch решения для офисов, шоурумов и диспетчерских с приоритетом на детализацию и цветопередачу.'
            },
            {
              href: '/outdoor-led-ekrany',
              label: 'Outdoor LED-экраны',
              description: 'Наружные экраны для стадионов, трасс и придорожных конструкций с максимальной яркостью и повышенной защитой от среды.'
            }
          ].map((item) => (
            <Reveal key={item.href}>
              <Card>
                <h3 className="text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                <Button href={item.href} variant="secondary" className="mt-4">Перейти</Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">FAQ</h2></Reveal>
        <div className="mt-6 space-y-3 md:mt-8">{faq.map(([q, a]) => <Reveal key={q}><details className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm leading-relaxed text-slate-300">{a}</p></details></Reveal>)}</div>
      </Section>


      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Подробнее о решениях Sapphire LED</h2></Reveal>
        <Reveal>
          <details className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <summary className="cursor-pointer text-lg font-medium text-cyan-200">Открыть SEO-обзор по выбору LED-экранов для бизнеса</summary>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-300 md:text-base">
              <p>
                LED экраны сегодня используются не только как витрина для яркого контента, но и как полноценный инструмент маркетинга и коммуникации.
                Для бизнеса это способ одновременно повысить узнаваемость бренда, поддерживать промо-кампании и показывать актуальную информацию в режиме реального времени.
                В зависимости от места установки и задач мы подбираем как интерьерные, так и уличные LED экраны, учитывая реальную дистанцию просмотра, уровень внешней засветки и режим работы оборудования.
                Такой инженерный подход помогает избежать переплаты и получить стабильную картинку без провалов по яркости или контрасту.
              </p>
              <h3 className="text-xl font-semibold text-white">Какие LED-экраны подходят для разных сценариев</h3>
              <p>
                Для фасадов и городских локаций чаще выбирают экраны для наружной рекламы с высоким уровнем яркости и защитой от влаги и пыли.
                Уличные LED экраны должны стабильно работать при перепадах температуры, выдерживать осадки и сохранять читаемость контента в солнечную погоду.
                Для торговых центров, шоурумов и офисов, наоборот, важнее точность цветопередачи и комфорт при близком просмотре.
                В таких проектах востребованы рекламные LED экраны с мелким шагом пикселя, а также панели для презентационных зон и переговорных.
                Если задача связана с охватом большого потока людей, используют большие LED экраны, которые обеспечивают заметность контента даже на значительной дистанции.
              </p>
              <h3 className="text-xl font-semibold text-white">Технические критерии выбора: шаг пикселя, яркость, защита</h3>
              <p>
                Светодиодные экраны для бизнеса подбираются по нескольким параметрам: шаг пикселя, яркость, угол обзора, частота обновления и класс защиты корпуса.
                Чем ближе зритель к поверхности, тем выше требования к плотности пикселей.
                Для улицы приоритетом становится запас яркости и соответствие IP-стандартам, а для видеостудий и трансляций — повышенная частота обновления без мерцания.
                Мы также учитываем конструктив площадки, доступ к обслуживанию и перспективы масштабирования, чтобы решение оставалось актуальным не один сезон.
              </p>
              <h3 className="text-xl font-semibold text-white">COB и GOB: когда эти технологии действительно полезны</h3>
              <p>
                При проектировании современных систем часто рассматривают технологии COB / GOB.
                COB помогает получить высокую однородность и аккуратную детализацию изображения на коротких дистанциях, что особенно важно для корпоративных пространств, диспетчерских и премиальных витрин.
                GOB добавляет защитный слой, повышая устойчивость поверхности к внешним воздействиям, поэтому такой формат актуален для общественных зон и интенсивной эксплуатации.
                Выбор между COB и GOB зависит от сценария использования, требований к визуальному качеству и бюджета проекта.
              </p>
              <h3 className="text-xl font-semibold text-white">Что получает компания после внедрения LED-решения</h3>
              <p>
                Грамотно спроектированные LED экраны дают бизнесу измеримый эффект: рост заметности, более высокую вовлеченность аудитории и удобное управление контентом для разных площадок.
                В наружной рекламе это помогает повысить частоту контакта с брендом, в ритейле — усиливать промо, а в корпоративной среде — улучшать навигацию и визуальные коммуникации.
                Мы дополняем поставку инженерной поддержкой, чтобы система была удобной в эксплуатации, масштабировалась под новые задачи и сохраняла качество изображения на всем жизненном цикле.
              </p>
            </div>
          </details>
        </Reveal>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <Reveal><h2 className="text-3xl font-semibold">Новости и статьи</h2></Reveal>
          <Button href="/blog" variant="secondary" className="self-center">Все материалы</Button>
        </div>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.slice(0, 6).map((item) => (
            <Reveal key={item.slug}>
              <Card className="flex min-h-[340px] flex-col overflow-hidden p-0">
                <div className="relative h-40 w-full">
                  <Image src={item.image} alt={item.coverAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
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

    </main>
  );
}
