import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { getProductBySlug, productsData } from '@/lib/content';
import { buildMetadata, productSchema } from '@/lib/seo';

export async function generateStaticParams() {
  return productsData.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return buildMetadata('Продукт не найден | SAP LED Systems', 'Страница продукта не найдена.', '/products');
  return buildMetadata(`${product.name} | SAP LED Systems`, product.shortDescription, `/products/${product.slug}`);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main>
      <JsonLd data={productSchema(product.name, product.shortDescription, product.slug)} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Image src={product.gallery[0]} alt={product.name} width={1200} height={800} className="rounded-2xl border border-white/10" />
          <div>
            <p className="text-cyan-300">{product.category}</p>
            <h1 className="mt-3 text-4xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-slate-300">{product.shortDescription}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">{Object.entries(product.specs).map(([key,val]) => <div key={key} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="text-slate-400">{key}</p><p className="mt-1 text-white">{val}</p></div>)}</div>
            <div className="mt-8 flex gap-3"><Button href="/request">Запросить цену</Button><Button href="/contacts" variant="secondary">Связаться с инженером</Button></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
