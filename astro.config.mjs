import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Update this once you know your live URL (Netlify default, or your custom domain later).
// It matters for the sitemap, RSS feed, and canonical/OG tags.
const SITE_URL = 'https://yigudimi.netlify.app';

export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap()],
  output: 'static',
});
