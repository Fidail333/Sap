import type { Metadata } from 'next';
import { SeoLandingPage } from '@/components/SeoLandingPage';
import { ledLandings } from '@/lib/seo-pages';
import { buildMetadata } from '@/lib/seo';

const page = ledLandings.find((item) => item.slug === 'led-ekrany');

export const metadata: Metadata = buildMetadata(page?.title ?? 'LED-экраны | Sapphire LED', page?.description ?? 'LED-экраны под проект в России.', '/led-ekrany');

export default function Page() {
  return <SeoLandingPage slug="led-ekrany" />;
}
