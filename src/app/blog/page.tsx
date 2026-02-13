import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { getPublishedBlogEntries } from '@/lib/cms';
import { articleSchema, buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = buildMetadata('Материалы | Sapphire LED', 'Новости и статьи о LED-модулях, монтаже и эксплуатации экранов.', '/blog');

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogEntries();

  return (
    <main>
      <JsonLd data={blogPosts.map((post) => articleSchema({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.image }))} />
      <Section>
        <h1 className="text-3xl font-semibold sm:text-4xl">Материалы: новости и статьи</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Подборка практических материалов по LED-технологиям, проектированию, монтажу и обслуживанию экранов.</p>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-52 w-full">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>
              </Link>
              <div className="p-5 md:p-6">
                <Badge>{post.type}</Badge>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  <Link href={`/blog/${post.slug}`} className="hover:text-cyan-200">{post.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
