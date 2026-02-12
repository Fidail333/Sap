import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { blogPosts } from '@/data/blog';
import { articleSchema, buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) return buildMetadata('Материал не найден | Sapphire LED', 'Материал не найден.', '/blog');
  return buildMetadata(`${post.title} | Sapphire LED`, post.excerpt, `/blog/${post.slug}`);
}

function renderContentBlocks(content: string) {
  return content.split('\n\n').map((block) => {
    if (block.startsWith('## ')) {
      return <h2 key={block} className="mt-8 text-2xl font-semibold text-slate-100">{block.replace('## ', '')}</h2>;
    }

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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd data={articleSchema({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.image })} />
      <Section>
        <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="relative h-64 w-full md:h-80">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
          </div>
          <div className="p-6 md:p-8">
            <Badge>{post.type}</Badge>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{post.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 px-2 py-1 text-xs text-slate-300">#{tag}</span>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-2">{renderContentBlocks(post.content)}</div>
            <Link href="/blog" className="mt-8 inline-flex text-sm text-cyan-300 hover:text-cyan-200">← К списку материалов</Link>
          </div>
        </article>
      </Section>
    </main>
  );
}
