import type { Metadata } from 'next';
import { SolutionPage } from '@/components/SolutionPage';
import { buildMetadata } from '@/lib/seo';
import { solutionPages } from '@/lib/seo-pages';

const page = solutionPages.find((item) => item.slug === 'naruzhnaya-reklama');

export const metadata: Metadata = buildMetadata(page?.title ?? 'Решения на LED-экранах | Sapphire LED', page?.description ?? 'Решения на LED-экранах для коммерческих задач.', '/resheniya/naruzhnaya-reklama');

export default function Page() {
  return <SolutionPage slug="naruzhnaya-reklama" />;
}
