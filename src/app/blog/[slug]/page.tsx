import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { getPublishedBlogEntryBySlug } from '@/lib/cms';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedBlogEntryBySlug(params.slug);
  if (!post) {
    return {
      title: 'Материал не найден | Sapphire LED',
      description: 'Материал не найден.',
      alternates: { canonical: '/blog' }
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'Sapphire LED',
      type: 'article',
      locale: 'ru_RU',
      images: [{ url: post.image }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.image]
    }
  };
}

function renderContentBlocks(content: string) {
  return content.split('\n\n').map((block) => {
    if (block.startsWith('### ')) return <h3 key={block} className="mt-7 text-xl font-semibold text-slate-100">{block.replace('### ', '')}</h3>;
    if (block.startsWith('## ')) return <h2 key={block} className="mt-8 text-2xl font-semibold text-slate-100">{block.replace('## ', '')}</h2>;
    if (block.startsWith('- ')) {
      return (
        <ul key={block} className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
          {block.split('\n').map((item) => <li key={item}>{item.replace('- ', '')}</li>)}
        </ul>
      );
    }
    return <p key={block} className="mt-4 leading-relaxed text-slate-300">{block}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPublishedBlogEntryBySlug(params.slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': post.type === 'Новости' ? 'NewsArticle' : 'Article',
          headline: post.title,
          description: post.excerpt,
          image: `${siteUrl}${post.image}`,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          author: { '@type': 'Organization', name: 'Sapphire LED' },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`
        }}
      />
      <Section>
        <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="relative h-64 w-full md:h-80">
            <Image src={post.image} alt={post.coverAlt} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
          </div>
          <div className="p-6 md:p-8">
            <Badge>{post.type}</Badge>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-4 border-t border-white/10 pt-2">{renderContentBlocks(post.content)}</div>
            <Link href="/blog" className="mt-8 inline-flex text-sm text-cyan-300 hover:text-cyan-200">← К списку материалов</Link>
          </div>
        </article>
      </Section>
    </main>
  );
}
