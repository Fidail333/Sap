import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/ui/Section';

const partners = [
  { name: 'Минюст РФ', logoSrc: '/visuals/1.jpg' },
  { name: 'ВКонтакте', logoSrc: '/visuals/2.jpg' },
  { name: 'Kazan Expo', logoSrc: '/visuals/3.png' },
  { name: 'Россия — моя история', logoSrc: '/visuals/4.jpeg' },
  { name: 'НИИ НДХиТ', logoSrc: '/visuals/5.jpg' },
  { name: 'Росатом', logoSrc: '/visuals/6.jpg' },
  { name: 'Музей совр. истории', logoSrc: '/visuals/7.png' },
  { name: 'Фонд Рошаля', logoSrc: '/visuals/8.png' },
  { name: 'Роснефть', logoSrc: '/visuals/9.png' },
  { name: 'Форум «Россия»', logoSrc: '/visuals/10.png' },
  { name: 'Минэнерго РФ', logoSrc: '/visuals/11.png' }
];

const marqueeItems = [...partners, ...partners];

export function PartnersMarquee() {
  return (
    <Section className="py-6 md:py-9 xl:py-12">
      <Reveal>
        <h2 className="text-3xl font-semibold">Наши заказчики</h2>
      </Reveal>
      <div className="relative mt-5 md:mt-6">
        <div className="partners-marquee flex gap-4 overflow-x-auto pb-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="partners-marquee-track flex min-w-max gap-4">
            {marqueeItems.map((partner, index) => (
              <article key={`${partner.name}-${index}`} className="min-w-[170px] rounded-2xl border border-white/8 bg-white/[0.02] p-3 backdrop-blur sm:min-w-[190px] sm:p-3.5">
                <div className="relative flex h-16 items-center justify-center sm:h-20 lg:h-24">
                  <Image src={partner.logoSrc} alt={partner.name} width={168} height={96} className="h-14 w-auto object-contain sm:h-16 lg:h-20" />
                </div>
                <p className="mx-auto mt-2 max-w-[15ch] truncate text-center text-sm font-medium text-white/90">{partner.name}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-950 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-950 to-transparent" aria-hidden="true" />
      </div>
    </Section>
  );
}
