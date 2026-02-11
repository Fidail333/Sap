'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: 'Главная' },
  { href: '/products', label: 'Каталог' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/blog', label: 'Материалы' }
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-cyan-300/40 bg-cyan-300/10 text-xs font-bold text-cyan-200">SL</span>
          <span>Sapphire LED</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('transition-colors hover:text-cyan-200', pathname === item.href ? 'text-cyan-300' : 'text-slate-300')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="tel:+79031108467"
          className="group rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-right transition hover:bg-cyan-300/20"
          aria-label="Позвонить в Sapphire LED"
        >
          <p className="inline-flex items-center gap-2 text-sm font-medium text-cyan-100">
            <span aria-hidden="true">📞</span>
            +7-903-110-84-67
          </p>
          <p className="text-[11px] text-slate-300">Пн–Пт 9:00–18:00</p>
        </Link>

        <nav className="flex w-full items-center justify-between gap-4 border-t border-white/10 pt-3 text-sm md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('transition-colors hover:text-cyan-200', pathname === item.href ? 'text-cyan-300' : 'text-slate-300')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
