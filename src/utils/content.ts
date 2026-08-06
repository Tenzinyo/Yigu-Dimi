import { getCollection } from 'astro:content';

export type ContentType = 'blog' | 'journal' | 'video' | 'art';

export interface FeedItem {
  type: ContentType;
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  href: string;
}

/** Merges all four content collections into one reverse-chronological feed. */
export async function getFeed(): Promise<FeedItem[]> {
  const isPublished = ({ data }: { data: { draft: boolean } }) => !data.draft;

  const [blog, journal, video, art] = await Promise.all([
    getCollection('blog', isPublished),
    getCollection('journal', isPublished),
    getCollection('video', isPublished),
    getCollection('art', isPublished),
  ]);

  const items: FeedItem[] = [
    ...blog.map((e) => ({
      type: 'blog' as const,
      slug: e.id,
      title: e.data.title,
      date: e.data.date,
      tags: e.data.tags,
      excerpt: e.data.description,
      image: e.data.cover,
      imageAlt: e.data.coverAlt,
      href: `/blog/${e.id}/`,
    })),
    ...journal.map((e) => ({
      type: 'journal' as const,
      slug: e.id,
      title: e.data.title,
      date: e.data.date,
      tags: e.data.tags,
      excerpt: e.data.mood ? `Mood: ${e.data.mood}` : undefined,
      image: e.data.cover,
      imageAlt: e.data.coverAlt,
      href: `/journal/${e.id}/`,
    })),
    ...video.map((e) => ({
      type: 'video' as const,
      slug: e.id,
      title: e.data.title,
      date: e.data.date,
      tags: e.data.tags,
      excerpt: e.data.description,
      image: e.data.thumbnail,
      imageAlt: e.data.thumbnailAlt,
      href: `/video/${e.id}/`,
    })),
    ...art.map((e) => ({
      type: 'art' as const,
      slug: e.id,
      title: e.data.title,
      date: e.data.date,
      tags: e.data.tags,
      excerpt: e.data.caption,
      image: e.data.image,
      imageAlt: e.data.imageAlt,
      href: `/art/${e.id}/`,
    })),
  ];

  return items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

/** All unique tags across every collection, for the /tags index. */
export function getAllTags(items: FeedItem[]): string[] {
  const tags = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export const typeLabels: Record<ContentType, string> = {
  blog: 'Blog',
  journal: 'Journal',
  video: 'Video',
  art: 'Art',
};
