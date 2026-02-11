import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { blogPosts } from '@/data/blog';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('Материалы | Sapphire LED', 'Новости и статьи о LED-модулях, монтаже и эксплуатации экранов.', '/blog');

export default function BlogPage() {
  return (
    <main>
      <Section>
        <h1 className="text-4xl font-semibold">Материалы: новости и статьи</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Подборка практических материалов по LED-технологиям, проектированию, монтажу и обслуживанию экранов.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Badge>{post.type}</Badge>
              <h2 className="mt-3 text-xl font-semibold text-white">
                <Link href={`/blog/${post.slug}`} className="hover:text-cyan-200">{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-2 py-1 text-xs text-slate-300">#{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
