# Yigu Dimi

A personal site for daily blogs, journal entries, videos, and artwork — built
to run on free hosting indefinitely, with a real browser-based admin UI so
publishing never requires touching code or a terminal.

## Stack, and why

- **[Astro](https://astro.build)**, static output. Content-heavy, mixed-media
  sites (markdown posts + images + video embeds) are exactly what Astro is
  built for: it ships zero JS by default, has first-class content collections
  with schema validation, and produces a plain `dist/` folder that any static
  host can serve for free.
- **[Decap CMS](https://decapcms.org)** (the maintained fork of Netlify CMS)
  for the admin UI at `/admin`. It's git-based: every post you publish from
  the browser becomes a markdown file committed straight to this repo. No
  database, no server to maintain, no separate service that can go down or
  start charging you.
- **[Netlify](https://netlify.com)**, free tier. It's the only one of the
  four free hosts (Netlify / Vercel / Cloudflare Pages / GitHub Pages) where
  Decap CMS gets single-user login for free with no extra setup — Netlify
  Identity + Git Gateway together give you a real login screen and a
  GitHub-write token, without standing up your own OAuth app or serverless
  function. Free tier: 100GB bandwidth/month, 300 build minutes/month, custom
  domains included.

## Folder structure

```
├── public/
│   ├── admin/              # Decap CMS — index.html + config.yml (the schema for every content type)
│   ├── images/uploads/     # Images uploaded from the CMS land here
│   ├── favicon.svg
│   ├── og-default.png      # Fallback social-share image
│   └── robots.txt
├── src/
│   ├── content.config.ts   # Schema for blog / journal / video / art (keep in sync with public/admin/config.yml)
│   ├── content/
│   │   ├── blog/            # One .md file per blog post
│   │   ├── journal/          # One .md file per journal entry
│   │   ├── video/            # One .md file per video post
│   │   └── art/               # One .md file per gallery piece
│   ├── components/         # Header, Footer, PostCard, TagList, Lightbox, FilterBar, ThemeToggle, BaseHead
│   ├── layouts/             # BaseLayout (site chrome), PostLayout (blog/journal post page)
│   ├── pages/               # Routes — index, /blog, /journal, /video, /art, /tags, rss.xml, 404
│   ├── styles/global.css   # Palette, fonts, manga panel/halftone/screentone system, dark theme
│   └── utils/                # Feed aggregation (content.ts), video embed parsing (video.ts)
├── astro.config.mjs
├── netlify.toml
└── .nvmrc                  # Node 22 (required by Astro 7)
```

## Local setup

Requires Node 22+ (`nvm use` will pick it up from `.nvmrc` if you have nvm).

```bash
npm install
npm run dev       # http://localhost:4321
```

`npm run build` runs `astro check` then builds to `dist/`. `npm run preview`
serves that build locally so you can sanity-check the production output.

You will not normally need to run any of this locally once the site is live
— publishing happens entirely through `/admin` in the browser (see below).

---

## Deploying — step by step

### 1. Push this repo to GitHub

```bash
git add -A
git commit -m "Initial site"
```

Then create an empty repo named `yigu-dimi` under your account
(`Tenzinyo`) at github.com/new — **don't** initialize it with a README,
license, or .gitignore (this repo already has one), then:

```bash
git remote add origin https://github.com/Tenzinyo/yigu-dimi.git
git branch -M main
git push -u origin main
```

### 2. Connect Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign up/log in with
   your GitHub account.
2. **Add new site → Import an existing project → Deploy with GitHub**, pick
   the `yigu-dimi` repo.
3. Build settings should auto-detect from `netlify.toml`
   (`npm run build`, publish directory `dist`) — confirm and deploy.
4. Your site is now live at `https://<random-name>.netlify.app`. You can
   rename that subdomain: **Site configuration → Domain management → Options
   → Edit site name** → set it to something like `yigu-dimi`, giving you
   `https://yigu-dimi.netlify.app`.
5. Update `SITE_URL` in `astro.config.mjs`, `site_url`/`display_url` in
   `public/admin/config.yml`, and the `Sitemap:` line in `public/robots.txt`
   to match your actual final URL (custom domain or the renamed
   `.netlify.app`), commit, and push — this matters for canonical URLs, the
   sitemap, RSS, and Open Graph tags to be correct.

### 3. Turn on Netlify Identity + Git Gateway (this is your login system)

This is what makes `/admin` a real, password-protected login screen that
only you can use — nobody can sign up on their own.

1. In your Netlify site dashboard: **Site configuration → Identity → Enable
   Identity**.
2. Under **Identity → Registration**, set it to **Invite only**. This is the
   step that keeps it single-user — nobody can self-register, ever.
3. Under **Identity → Services**, enable **Git Gateway**. This is what lets
   Decap CMS commit to GitHub on your behalf using a token Netlify manages —
   you never generate or paste a GitHub token yourself.
4. Go to the **Identity** tab (top-level, not inside Settings) and click
   **Invite users**. Invite your own email address
   (`aayushbashyal7283@gmail.com`, or whichever you prefer).
5. Check that inbox for the invite email, click the link — it'll land on
   your live homepage and pop up a "set your password" modal (that's the
   script wired up in `src/pages/index.astro`). Set a password.
6. Go to `https://<your-site>/admin/`, log in with that email + password.
   You're in.

**Rotating or resetting access later:**

- **Forgot your password**: go to `/admin/`, click "Forgot password" on the
  login form (Identity handles the reset email).
- **Revoke access entirely**: Netlify dashboard → Identity → find your user
  → delete them, then re-invite. This immediately invalidates their session.
- **Add a second trusted person**: Identity → Invite users → their email.
  Registration stays "Invite only," so this is still not public.

### 4. Auto-deploy on every publish

Nothing to configure here — it's already wired up. Netlify's GitHub
integration watches `main`. Every time you publish from `/admin` (which
commits a file to `main`) or you `git push` yourself, Netlify rebuilds and
redeploys automatically. No GitHub Actions needed, no manual redeploy step,
ever.

### 5. Custom domain later (optional, ~$10–15/yr)

1. Buy a domain anywhere (Namecheap, Porkbun, Cloudflare Registrar — Porkbun
   and Cloudflare tend to be cheapest with no markup).
2. Netlify dashboard → **Domain management → Add a domain**, enter it.
3. Netlify gives you DNS records (either delegate nameservers to Netlify DNS,
   or add an A/CNAME at your registrar). Follow whichever option Netlify
   shows you — nameserver delegation is simpler and gives you free HTTPS
   automatically.
4. HTTPS certificate provisions automatically within a few minutes once DNS
   propagates.
5. Update `SITE_URL` / `site_url` / `display_url` / `robots.txt` again (see
   step 2.5 above) to the new domain, commit, push.

---

## Content-authoring guide (entirely from the browser)

1. Go to `https://<your-site>/admin/` and log in.
2. Pick a collection in the left sidebar: **Blog**, **Journal**, **Video**,
   or **Art**.
3. Click **New [Blog post / Journal entry / Video post / Art piece]**.
4. Fill in the fields:
   - **Blog / Journal**: title, date, tags, optional cover image, then paste
     or write your text into the body editor (rich text or raw markdown —
     toggle in the top-right of the editor). Pasting from Google Docs or
     Notes works fine; formatting carries over reasonably well.
   - **Video**: paste a normal YouTube or Vimeo link (the one from the
     "Share" button, e.g. `https://www.youtube.com/watch?v=...` or
     `https://vimeo.com/...`) into **Video link** — it embeds automatically,
     no extra steps.
   - **Art**: upload the image file directly (drag-and-drop or file picker),
     write **Image alt text** (required — this is what screen readers read
     aloud, and it matters for accessibility), and an optional caption.
5. Leave **Draft** checked while you're still working on something — draft
   posts never appear on the live site or in the RSS feed, but you can save
   and come back to them later from the CMS.
6. When ready, uncheck **Draft** (or check **Publish** if using the top-right
   publish button — same effect) and hit **Publish**.
7. That's it. Decap commits the file to GitHub, Netlify sees the push and
   rebuilds, and the new post is live within roughly a minute — no redeploy
   step on your end.

**Editing or deleting**: open any collection in the sidebar, click an
existing entry to edit it and re-publish, or use the entry's menu (⋮) to
delete it.

**Tags**: just type them into the Tags field, one per line/chip — any tag
you use automatically gets its own filter page at `/tags/<tag>/`.

---

## Design system

All colors are CSS custom properties in `src/styles/global.css` — never
hardcode the hex values elsewhere:

| Variable | Value | Use |
|---|---|---|
| `--color-cream` | `#FFF7EB` | Primary background |
| `--color-parchment` | `#F9F0E0` | Card/panel background |
| `--color-sage` | `#A2AB73` | Accents, tag chips, secondary buttons |
| `--color-sage-deep` | `#696F4B` | Body text/links on cream (AA-safe variant of sage) |
| `--color-crimson` | `#CC3A63` | Primary accent, CTAs, active states |
| `--color-ink` | `#201A17` | Panel borders, body text |

A dark theme (toggle in the header, persisted via `localStorage`) is defined
under `:root[data-theme="dark"]` in the same file, derived from the same
crimson/sage accents on a warm near-black ground.

Fonts: **Bangers** (display/headings) + **Inter** (body), loaded from Google
Fonts in `BaseHead.astro`.

The manga-panel look comes from a few reusable utility classes:
`.panel` (thick border + hard drop-shadow), `.halftone` (dot-texture overlay,
low opacity), `.screentone` (diagonal line shading), `.speed-lines`
(radiating hero accent) — all in `global.css`.

### Accessibility notes

- Crimson-on-cream body text measures **~4.54:1** contrast — passes WCAG AA
  (4.5:1) for normal text, but it's close to the line. It's used for
  buttons/large headings/active states here, which only need 3:1; if you use
  crimson for small regular-weight text, prefer `--color-crimson-deep`
  instead.
- Sage-on-cream measures **~2.3:1** — this **fails** AA even for large text,
  so raw `--color-sage` is only used for backgrounds/borders/tag chips
  (which pair it with dark ink text on top), never as a text color on cream.
  `--color-sage-deep` (~5:1) is the AA-safe variant used for links and
  muted text.
- The **Art** collection's `imageAlt` field is required in both the content
  schema and the CMS — you cannot publish an image without alt text.
- Run your own spot-check with a tool like the
  [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/)
  once real content/images are in, especially for any new accent-color
  combinations you introduce.

## Staying on free tiers as this grows

- **Bandwidth** (Netlify free: 100GB/mo): video is embedded from YouTube/
  Vimeo, not self-hosted, so it costs you nothing regardless of views.
  Images are the only thing served from Netlify's bandwidth — keep uploads
  reasonably sized (a few MB max) and this won't be a concern for a personal
  site for a very long time.
- **Build minutes** (300/mo free): each publish triggers one build, which
  takes seconds for a site this size. You'd need >100 publishes/day to get
  close to the limit.
- **Git Gateway / repo size**: images live in the git repo itself
  (`public/images/uploads`). This is fine for a personal blog for years, but
  if the gallery grows very large (hundreds of high-res photos), consider
  moving to a dedicated free image host (e.g. Cloudflare Images free tier,
  or Cloudinary's free tier) later — flagging it now so it's not a surprise.
- **Netlify Identity**: free for up to 1,000 active users. You'll only ever
  have one (you), so this is a non-issue.

Nothing above requires a credit card to set up.
