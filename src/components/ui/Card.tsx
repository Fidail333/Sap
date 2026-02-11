import { cn } from '@/lib/utils';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <article className={cn('rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur', className)}>{children}</article>;
}
