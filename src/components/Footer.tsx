import Link from 'next/link';
import { Container } from './ui/Container';

const quickLinks = [
  { href: '/privacy', label: 'Политика конфиденциальности' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/about', label: 'О компании' },
  { href: '/blog', label: 'Материалы' }
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 py-10 text-sm text-slate-400">
      <Container className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-cyan-300/40 bg-cyan-300/10 text-[10px] font-bold text-cyan-200">SL</span>
            <p className="text-base font-semibold text-white">Sapphire LED</p>
          </div>
          <p className="mt-3">Поставка LED-модулей и комплектующих для экранов с инженерной поддержкой и надежной логистикой.</p>
        </div>
        <div>
          <p className="font-medium text-slate-100">Ссылки</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
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
