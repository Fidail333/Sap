import { cn } from '@/lib/utils';
import { Container } from './Container';

export function Section({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('py-10 md:py-16 xl:py-20', className)}>
      <Container>{children}</Container>
    </section>
  );
}
