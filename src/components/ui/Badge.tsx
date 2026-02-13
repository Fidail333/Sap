const badgeStyles: Record<string, string> = {
  'Хит продаж': 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100',
  'Хиты продаж': 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100',
  'Мы советуем': 'border-sky-300/35 bg-sky-300/10 text-sky-100',
  'Новинка': 'border-amber-300/35 bg-amber-300/10 text-amber-100',
  'Новинки': 'border-amber-300/35 bg-amber-300/10 text-amber-100'
};

export function Badge({ children }: { children: React.ReactNode }) {
  const label = typeof children === 'string' ? children : '';
  const tone = badgeStyles[label] ?? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
      {children}
    </span>
  );
}
