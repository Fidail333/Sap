import Image from 'next/image';
import Link from 'next/link';
import { Container } from './ui/Container';

const quickLinks = [
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/about', label: 'О компании' },
  { href: '/blog', label: 'Материалы' },
  { href: '/catalog', label: 'Каталог' }
] as const;

const popularSections = [
  { href: '/ulichnye-led-ekrany', label: 'Уличные LED-экраны' },
  { href: '/reklamnye-led-ekrany', label: 'Рекламные LED-экраны' },
  { href: '/bolshie-led-ekrany', label: 'Большие LED-экраны' },
  { href: '/indoor-led-ekrany', label: 'LED-экраны для помещений' },
  { href: '/contacts', label: 'Контакты' }
] as const;

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-slate-950 py-10 md:mt-16 text-sm text-slate-400">
      <Container className="grid gap-8 md:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="Sapphire LED — главная страница">
            <Image src="/visuals/logo.svg" alt="Sapphire LED" width={158} height={36} className="h-8 w-auto" />
          </Link>
          <p className="mt-3">Поставка LED-модулей и комплектующих для экранов с инженерной поддержкой и надежной логистикой.</p>
        </div>
        <div>
          <p className="font-medium text-slate-100">Навигация</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-100">Популярные разделы</p>
          <ul className="mt-3 space-y-2">
            {popularSections.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-100">Контакты</p>
          <p className="mt-3">
            <a href="tel:+79031108467" className="hover:text-cyan-200">+7-903-110-84-67</a>
          </p>
          <p>
            <a href="mailto:mail@led-modules.ru" className="hover:text-cyan-200">mail@led-modules.ru</a>
          </p>
          <p>Пн–Пт 9:00–18:00</p>
          <p className="mt-2">
            <Link href="/contacts" className="text-cyan-300">Страница контактов</Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
