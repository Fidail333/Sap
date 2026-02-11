import Link from 'next/link';
import { Container } from './ui/Container';

const quickLinks = [
  { href: '/products', label: 'Продукты' },
  { href: '/cases', label: 'Кейсы' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/privacy', label: 'Политика обработки персональных данных' }
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 py-10 text-sm text-slate-400">
      <Container className="grid gap-8 md:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-white">SAP LED Systems</p>
          <p className="mt-3">Премиальные LED-экраны и инженерные решения под ключ для B2B-проектов.</p>
        </div>
        <div>
          <p className="font-medium text-slate-100">Навигация</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-100">Контакты</p>
          <p className="mt-3">+7 (495) 145-88-40</p>
          <p>sales@sap-led.ru</p>
          <p>Москва, Ленинградский пр-т, 37к3</p>
          <p>Пн–Пт 9:00–18:00</p>
        </div>
        <div>
          <p className="font-medium text-slate-100">Реквизиты</p>
          <p className="mt-3">ООО «САП ЛЕД СИСТЕМС»</p>
          <p>ИНН 7714458890</p>
          <p>ОГРН 1237700123456</p>
          <p className="mt-3">Telegram · WhatsApp · VK</p>
        </div>
      </Container>
    </footer>
  );
}
