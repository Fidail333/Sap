'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Главная' },
  { href: '/sapphire', label: 'Sapphire' },
  { href: '/modules', label: 'Modules' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/request', label: 'Оставить заявку' }
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">SAP LED</Link>
        <nav className="hidden gap-5 text-sm md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'text-primary' : 'text-slate-600 hover:text-ink'}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
