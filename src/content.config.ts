import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared fields every content type carries, matching the CMS collections in
// public/admin/config.yml one-to-one. If you add/rename a field here, update
// that file too, or the CMS UI will fall out of sync with what Astro expects.
const base = {
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    ...base,
    description: z.string().max(280).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    ...base,
    mood: z.string().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
});

const video = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/video' }),
  schema: z.object({
    ...base,
    description: z.string().max(280).optional(),
    videoUrl: z.string().url(),
    thumbnail: z.string().optional(),
    thumbnailAlt: z.string().optional(),
  }),
});

const art = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/art' }),
  schema: z.object({
    ...base,
    caption: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(), // required: no image ships without alt text
  }),
});

export const collections = { blog, journal, video, art };
