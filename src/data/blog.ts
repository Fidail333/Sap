import blogContent from '../../content/blog.json';

export type BlogType = 'Новости' | 'Статья';

export type BlogItem = {
  slug: string;
  type: BlogType;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  image: string;
  coverAlt: string;
  imagePrompt: string;
  tags: string[];
  datePublished: string;
  dateModified: string;
};

export const blogPosts: BlogItem[] = blogContent as BlogItem[];
