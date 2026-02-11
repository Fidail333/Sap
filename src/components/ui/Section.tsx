import { cn } from '@/lib/utils';
import { Container } from './Container';

export function Section({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <Container>{children}</Container>
    </section>
  );
}
