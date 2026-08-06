import rss from '@astrojs/rss';
import { getFeed } from '../utils/content';

export async function GET(context) {
  const feed = await getFeed();

  return rss({
    title: 'Yigu Dimi',
    description: 'Daily blogs, journal entries, videos, and artwork.',
    site: context.site,
    items: feed.map((item) => ({
      title: item.title,
      pubDate: item.date,
      description: item.excerpt ?? item.title,
      link: item.href,
      categories: item.tags,
    })),
  });
}
