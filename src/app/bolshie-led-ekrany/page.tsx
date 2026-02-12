import type { Metadata } from 'next';
import { SeoLandingPage } from '@/components/SeoLandingPage';
import { ledLandings } from '@/lib/seo-pages';
import { buildMetadata } from '@/lib/seo';

const page = ledLandings.find((item) => item.slug === 'bolshie-led-ekrany');

export const metadata: Metadata = buildMetadata(page?.title ?? 'LED-экраны | Sapphire LED', page?.description ?? 'LED-экраны под проект в России.', '/bolshie-led-ekrany');

export default function Page() {
  return <SeoLandingPage slug="bolshie-led-ekrany" />;
}
