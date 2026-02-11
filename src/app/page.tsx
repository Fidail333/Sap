import type { Metadata } from 'next';
import Image from 'next/image';
import { CatalogCard } from '@/components/CatalogCard';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { casesData, productsData } from '@/lib/content';
import { blogPosts } from '@/data/blog';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Премиальные LED-решения для бизнеса | Sapphire LED', 'LED-экраны для indoor, outdoor, rental и control rooms с инженерным сопровождением и сервисом.', '/');

const solutions = [
  ['Indoor', 'Fine-pitch панели для переговорных, лобби и шоурумов.'],
  ['Outdoor', 'Яркие IP65 экраны для фасадов, рекламы и городской среды.'],
  ['Rental & Stage', 'Легкие кабинеты для событий, концертов и XR-площадок.'],
  ['Corporate Control Rooms', 'Ситуационные и диспетчерские центры 24/7.']
];

const advantages = ['Контраст до 10000:1', 'Яркость до 7000 nit', 'Сервис 48h SLA', 'Гарантия до 5 лет', '100% QC на производстве', 'Логистика и монтаж под ключ'];
const process = ['Бриф и аудит площадки', 'Подбор серии и пилотный расчет', 'Производство, поставка, калибровка', 'Монтаж, запуск и сервис'];
const faq = [
  ['Какой шаг пикселя выбрать?', 'Для расстояния просмотра до 2 м выбирают P0.9–P1.5, для 3–6 м подходят P2.5–P4.'],
  ['Сколько длится поставка?', 'Стандартные серии — от 4 до 7 недель, проектные решения — по согласованному графику.'],
  ['Есть ли гарантия?', 'Да, базово 3 года с возможностью расширения до 5 лет и SLA-пакетами.'],
  ['Можно ли сделать тестовый участок?', 'Да, предоставляем пилот 1–2 кабинета и поддержку инженера на этапе согласования.'],
  ['Как управляется контент?', 'Интегрируем с популярными CMS signage и удаленным мониторингом состояния экранов.'],
  ['Делаете ли вы монтаж?', 'Да, обеспечиваем проектирование металлоконструкций, монтаж и пусконаладку.']
];

export default function Home() {
  return (
    <main>
      <Section className="pt-12 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Badge>Premium LED integrator</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">Инженерные LED-экраны для брендов, инфраструктуры и корпоративных пространств.</h1>
            <p className="mt-6 max-w-xl text-slate-300">Проектируем, поставляем и сопровождаем LED-системы полного цикла: от концепции и контента до монтажа и сервисной поддержки.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products">Подобрать экран</Button>
              <Button href="/contacts">Получить коммерческое предложение</Button>
            </div>
          </Reveal>
          <Reveal>
            <div className="scanline relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-900/70 p-3">
              <Image src="/visuals/hero-led-wall.svg" alt="LED media wall" width={1400} height={900} className="h-auto w-full rounded-2xl" priority />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="solutions">
        <Reveal><h2 className="text-3xl font-semibold">Решения</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{solutions.map(([title,text]) => <Reveal key={title}><Card><h3 className="text-xl font-medium">{title}</h3><p className="mt-2 text-sm text-slate-300">{text}</p></Card></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Преимущества</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{advantages.map((item) => <Reveal key={item}><Card className="text-sm">{item}</Card></Reveal>)}</div>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-6"><Reveal><h2 className="text-3xl font-semibold">Популярные серии</h2></Reveal><Button href="/products" variant="secondary">Весь каталог</Button></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{productsData.slice(0,6).map((item) => <Reveal key={item.id}><CatalogCard item={item} /></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Процесс работы</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{process.map((item, index) => <Reveal key={item}><Card><p className="text-cyan-300">0{index + 1}</p><p className="mt-2 text-sm text-slate-300">{item}</p></Card></Reveal>)}</div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">FAQ</h2></Reveal>
        <div className="mt-8 space-y-3">{faq.map(([q,a]) => <Reveal key={q}><details className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm text-slate-300">{a}</p></details></Reveal>)}</div>
      </Section>


      <Section>
        <div className="flex items-end justify-between gap-6">
          <Reveal><h2 className="text-3xl font-semibold">Новости и статьи</h2></Reveal>
          <Button href="/blog" variant="secondary">Все материалы</Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.slice(0, 5).map((item) => (
            <Reveal key={item.slug}>
              <Card>
                <p className="text-xs text-cyan-300">{item.type}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <Button href={`/blog/${item.slug}`} variant="secondary" className="mt-4">Читать</Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal><h2 className="text-3xl font-semibold">Недавние кейсы</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{casesData.slice(0,3).map((item) => <Reveal key={item.slug}><Card><p className="text-xs text-cyan-300">{item.industry}</p><h3 className="mt-2 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm text-slate-300">{item.result}</p></Card></Reveal>)}</div>
      </Section>
    </main>
  );
}
