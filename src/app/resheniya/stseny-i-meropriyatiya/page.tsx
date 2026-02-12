import type { Metadata } from 'next';
import { SolutionPage } from '@/components/SolutionPage';
import { buildMetadata } from '@/lib/seo';
import { solutionPages } from '@/lib/seo-pages';

const page = solutionPages.find((item) => item.slug === 'stseny-i-meropriyatiya');

export const metadata: Metadata = buildMetadata(page?.title ?? 'Решения на LED-экранах | Sapphire LED', page?.description ?? 'Решения на LED-экранах для коммерческих задач.', '/resheniya/stseny-i-meropriyatiya');

export default function Page() {
  return <SolutionPage slug="stseny-i-meropriyatiya" />;
}
