'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/blog', label: 'Материалы' }
] as const;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-cyan-100" aria-hidden="true">
      <path d="M21 16.5V20a1 1 0 0 1-1.1 1A18.9 18.9 0 0 1 11.7 18a18.6 18.6 0 0 1-5.8-5.8A18.9 18.9 0 0 1 3 4.1 1 1 0 0 1 4 3h3.5a1 1 0 0 1 1 .9c.1.9.4 1.8.7 2.7a1 1 0 0 1-.2 1l-1.5 1.5a16 16 0 0 0 6.9 6.9l1.5-1.5a1 1 0 0 1 1-.2c.9.3 1.8.6 2.7.7a1 1 0 0 1 .9 1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NavLabel({ href, label }: { href: string; label: string }) {
  if (href !== '/about') return <>{label}</>;

  return (
    <>
      <span className="sm:hidden">Компания</span>
      <span className="hidden sm:inline">О компании</span>
    </>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-10">
        <Link href="/" className="inline-flex items-center" aria-label="Sapphire LED — главная страница">
          <Image src="/visuals/logo.svg" alt="Sapphire LED" width={220} height={50} className="h-9 w-auto sm:h-10" priority />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('transition-colors hover:text-cyan-200', pathname === item.href ? 'text-cyan-300' : 'text-slate-300')}
            >
              <NavLabel href={item.href} label={item.label} />
            </Link>
          ))}
        </nav>


        <button
          type="button"
          data-chat-open
          className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/20 sm:text-sm"
          aria-label="Открыть чат с инженером"
        >
          Чат
        </button>

        <Link
          href="tel:+79031108467"
          className="group rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-2.5 py-2 transition hover:bg-cyan-300/20 md:px-3"
          aria-label="Позвонить в Sapphire LED"
        >
          <p className="inline-flex items-center gap-2 text-xs font-medium text-cyan-100 sm:text-sm">
            <PhoneIcon />
            <span className="hidden sm:inline">+7-903-110-84-67</span>
            <span className="sm:hidden">Позвонить</span>
          </p>
          <p className="hidden text-[11px] text-slate-300 sm:block">Пн–Пт 9:00–18:00</p>
        </Link>

        <nav className="flex w-full items-center justify-between gap-2 overflow-x-auto border-t border-white/10 pt-3 text-sm md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn('shrink-0 text-xs transition-colors hover:text-cyan-200 sm:text-sm', pathname === item.href ? 'text-cyan-300' : 'text-slate-300')}
            >
              <NavLabel href={item.href} label={item.label} />
            </Link>
          ))}
          <button
            type="button"
            data-chat-open
            className="shrink-0 rounded-lg border border-cyan-300/30 px-2 py-1 text-xs text-cyan-100"
            aria-label="Открыть чат с инженером"
          >
            Чат
          </button>
        </nav>
      </div>
    </header>
  );
}
