'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: 'Главная' },
  { href: '/products', label: 'Продукты' },
  { href: '/cases', label: 'Кейсы' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' }
] as const;

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="text-lg font-semibold tracking-wide text-white">SAP LED Systems</Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn('transition-colors hover:text-cyan-200', pathname === item.href ? 'text-cyan-300' : 'text-slate-300')}>
              {item.label}
            </Link>
          ))}
          <Link href="/contacts" className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-cyan-100 transition hover:bg-cyan-300/20">Связаться с инженером</Link>
        </nav>
      </div>
    </header>
  );
}
