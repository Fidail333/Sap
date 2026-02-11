import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { blogPosts } from '@/data/blog';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) return buildMetadata('Материал не найден | Sapphire LED', 'Материал не найден.', '/blog');
  return buildMetadata(`${post.title} | Sapphire LED`, post.excerpt, `/blog/${post.slug}`);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <main>
      <Section>
        <article className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <Badge>{post.type}</Badge>
          <h1 className="mt-3 text-3xl font-semibold">{post.title}</h1>
          <p className="mt-4 text-slate-300">{post.content}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/20 px-2 py-1 text-xs text-slate-300">#{tag}</span>
            ))}
          </div>
          <Link href="/blog" className="mt-6 inline-flex text-sm text-cyan-300 hover:text-cyan-200">← К списку материалов</Link>
        </article>
      </Section>
    </main>
  );
}
