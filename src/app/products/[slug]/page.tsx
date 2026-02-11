import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ProductContactButton } from '@/components/ProductContactButton';
import { Section } from '@/components/ui/Section';
import { getProductBySlug, productsData } from '@/lib/content';
import { formatAvailabilityLabel, formatPrice, productTechLabel } from '@/lib/product-format';
import { buildMetadata, productSchema } from '@/lib/seo';

export async function generateStaticParams() {
  return productsData.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return buildMetadata('Продукт не найден | Sapphire LED', 'Страница продукта не найдена.', '/products');
  return buildMetadata(`${product.name} | Sapphire LED`, product.short_description, `/products/${product.id}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const attrs: Array<[string, string]> = [
    ['Бренд', product.brand],
    ['Pitch', `P${product.pitch_mm}`],
    ['Среда эксплуатации', product.environment === 'indoor' ? 'Для помещений' : 'Уличный'],
    ['Исполнение', product.is_flexible ? 'Гибкий' : 'Жёсткий'],
    ['Технология', productTechLabel(product)],
    ['Частота обновления', product.refresh_hz ? `${product.refresh_hz} Hz` : '—'],
    ['Размер', product.size_mm ?? '—'],
    ['Сканирование', product.scan ?? '—'],
    ['Толщина', product.thickness_mm ? `${product.thickness_mm} мм` : '—'],
    ['Чипсет', product.chipset ?? '—']
  ];

  return (
    <main>
      <JsonLd data={productSchema(product.name, product.short_description, product.id)} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Image src={product.image} alt={product.name} width={1200} height={900} className="rounded-2xl border border-white/10" />
          <div>
            <p className="text-cyan-300">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-slate-300">{product.short_description}</p>
            <p className="mt-4 text-xl font-medium text-cyan-300">{formatPrice(product.price_rub)}</p>
            <p className="mt-2 inline-flex rounded-full border border-emerald-400/40 px-3 py-1 text-sm text-emerald-300">{formatAvailabilityLabel(product.availability)}</p>
            <div className="mt-4 flex flex-wrap gap-2">{product.badges.map((badge) => <span key={badge} className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">{badge}</span>)}</div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {attrs.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-slate-400">{key}</p>
                  <p className="mt-1 text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8"><ProductContactButton productName={product.name} /></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
