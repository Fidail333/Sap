import Link from 'next/link';
import { cn } from '@/lib/utils';

const base = 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300';

export function Button({ href, children, variant = 'primary', className }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary'; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        variant === 'primary'
          ? 'bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(34,211,238,0.75)]'
          : 'border border-white/20 bg-white/5 text-slate-100 hover:bg-white/10',
        className
      )}
    >
      {children}
    </Link>
  );
}
