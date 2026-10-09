# JF Oxicorte website

One-page website for JF Oxicorte (laser cutting, oxy-fuel cutting and sheet-metal
bending). Built with Next.js App Router (static export), React, TypeScript,
Tailwind CSS v4 and shadcn/ui (Radix). The output is plain HTML/CSS/JS meant to
be hosted on S3 + CloudFront; no Node.js server is used in production.

## Getting started

Use Node.js 22.13 or newer and npm (Node.js 24 LTS recommended).

```sh
npm ci
npm run dev        # http://localhost:3000
```

## Commands

| Command            | Purpose                                                           |
| ------------------ | ----------------------------------------------------------------- |
| `npm run dev`      | Dev server with hot reload; also rebuilds photos as you add them. |
| `npm run build`    | Production build (photos included), exported to `out/`.           |
| `npm run preview`  | Serve `out/` locally (build first).                               |
| `npm run images`   | Build the photos from `assets-src/photos/` (see below).           |
| `npm run icons`    | Regenerate favicon and app icons from the logo.                   |
| `npm run check`    | Lint (warnings fail), formatting and strict type checks.          |
| `npm run format`   | Format code and docs, including Tailwind class ordering.          |
| `npm run lint:fix` | Fix lint issues where possible.                                   |

Before deploying, run `npm run check` and `npm run build`.

## Before going live

Everything below lives in [`src/config/site.ts`](src/config/site.ts) and is read
at build time, so rebuild after any change.

- **Contacts** — `whatsapp` (55 + area code + number), `email` and
  `instagram` (full HTTPS URL). While a channel is empty, every link for it opens
  an "em atualização" notice instead of pointing to a fake number or profile. The
  contact section shows `contato@jfoxicorte.example` until `email` is filled. A
  filled but malformed value fails the build.
- **Domain** — set `SITE_URL` (e.g. `SITE_URL=https://www.jfoxicorte.com.br` in
  `.env.production` or in the CI environment). Without it the build omits the
  canonical URL, `og:url`/`og:image`, the sitemap entries and the sitemap line in
  `robots.txt`, because those must be absolute URLs.
- **Business details** — `serviceRegion`, `businessHours`, `city` and `state`.
  They feed the footer and the LocalBusiness structured data; the footer shows a
  neutral fallback text while they are empty.
- **Photos** — `assets-src/photos/` holds transparent placeholders, so every
  photo slot shows a loading skeleton. Replace them with real work photos and
  write each gallery photo's text (see [Images](#images)).

Page copy (services, materials, gallery titles, FAQ, navigation) is in
[`src/content/home.ts`](src/content/home.ts).

## Images

Original photos live in `assets-src/photos/`, one folder per place on the page.
Photos are numbered; any of JPEG, PNG, WebP or AVIF works.

```text
assets-src/photos/
  hero/1.jpg             Hero background (also the Open Graph image)
  services/1.jpg …       "O que fazemos" cards, in the order of `services` in home.ts
  gallery/<id>/1.jpg     "Do material à forma" gallery photos, shown in number order
  gallery/<id>/1.json    Text shown on that photo: { "text": "Visão geral" }
```

- **Hero and services** have no text. Their alt text stays in the code
  (`hero.tsx` and `alt` in each service of [`home.ts`](src/content/home.ts)).
  `services/` needs exactly one photo per service.
- **Galleries**: each folder name is the `id` of a gallery in `home.ts`
  (`laser`, `oxicorte`, `dobra`). Every photo needs a JSON file with the same
  number containing only `text`. The photo's alt text is the gallery title plus
  that text (e.g. "Corte a laser: Visão geral"). To add a gallery, add the
  folder and an entry in `galleries`.
- Photos are cropped to their slot from the center, so keep the subject roughly
  centered.

To add, replace or remove a photo, change the files and commit. Straight from
the camera is fine: EXIF rotation is applied, metadata (including GPS) is
stripped and the size is capped at 1600px wide. Export HEIC photos as JPEG
first. `npm run dev` picks changes up while running, and `npm run build` and
`npm run check` run `npm run images` first, so CI only needs
`npm ci && npm run build`. A layout mistake (missing or malformed JSON, a
non-numbered file, a gallery folder without a matching `id`, a wrong number of
service photos) fails with a message naming the file.

`scripts/images.mjs` writes WebP variants at 480/800/1200/1600px to
`public/images/<name>.<hash>-<width>.webp` and records each photo's size,
variants, text and a tiny blurred preview in `src/lib/photos.generated.json`,
which [`src/lib/images.ts`](src/lib/images.ts) reads. Unchanged photos are
skipped and outdated variants are deleted. All of these outputs (and
`public/og-image.jpg`) are git-ignored; only the originals are committed.

While a photo downloads, its slot shows the blurred preview. Transparent images
are treated as placeholders and show a pulsing skeleton instead, so real photos
must be opaque. The script warns about placeholders and about photos narrower
than 1600px.

The favicon and app icons come from `assets-src/brand/logo-mark.svg`; run
`npm run icons` after changing the logo and commit the results.

## Project layout

```text
assets-src/               Original photos and brand files (not deployed)
scripts/                  Photo pipeline, icon generation, dev runner
public/                   Files copied as-is to the export (icons; generated photos)
src/app/                  Layout, page, 404, metadata routes (robots, sitemap, manifest)
src/components/sections/  Page sections (hero, about, services, materials, projects, FAQ, contact)
src/components/site/      Header, footer, menu, contact links/notice, icons, brand
src/components/ui/        shadcn/ui primitives (button, dialog)
src/config/site.ts        Business data and contact configuration
src/content/home.ts       Page copy
```

Notes:

- Mobile-first, with breakpoints at 481, 700, 801 (desktop navigation), 1101 and
  1600px. Each section fills one viewport below the sticky header.
- The page works without JavaScript: content, links, the FAQ (`<details>`) and the
  services row (CSS scroll snap) are server-rendered. JavaScript adds the mobile
  menu, gallery carousels and lightbox, the contact notice and the floating
  WhatsApp button offset.
- Motion respects `prefers-reduced-motion`.

## Deploying to S3 + CloudFront

`next.config.ts` uses `output: "export"`, `trailingSlash: true` and
`images.unoptimized: true`. The build writes everything to `out/`.

### One-time setup

1. Create a private S3 bucket (Block Public Access on). Static website hosting is
   not needed.
2. Create a CloudFront distribution with the bucket as origin using **Origin
   Access Control (OAC)**, and apply the bucket policy CloudFront suggests.
3. Distribution settings:
   - Default root object: `index.html`.
   - Viewer protocol policy: Redirect HTTP to HTTPS. Enable compression
     (Brotli/Gzip) with the `CachingOptimized` policy.
   - Custom error responses: 403 and 404 → `/404.html`, response code 404 (with
     OAC, S3 answers 403 for missing keys).
   - Attach the domain's ACM certificate (us-east-1) and alternate domain names.
   - Optional: a response headers policy with security headers (HSTS,
     `X-Content-Type-Options`, `Referrer-Policy`).
4. Redirect the apex/`www` variant you don't use to the canonical `SITE_URL`.

### Each release

```sh
SITE_URL=https://www.example.com.br npm run build

# Fingerprinted assets (scripts, styles, photos): cache for a year.
aws s3 sync out/_next/static s3://BUCKET/_next/static \
  --cache-control "public, max-age=31536000, immutable"
aws s3 sync out/images s3://BUCKET/images \
  --cache-control "public, max-age=31536000, immutable"

# Everything else (HTML, icons, OG image, robots, sitemap, manifest): revalidate.
aws s3 sync out s3://BUCKET --delete \
  --exclude "_next/static/*" --exclude "images/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

Upload the fingerprinted folders first so new HTML never references missing
files. They are synced without `--delete`, so pages still cached by visitors
keep working; prune old files occasionally if the bucket size matters.

The site is a single page, so CloudFront's default root object is the only
`index.html` lookup needed. If you add routes later, also add a CloudFront
Function that rewrites `/path/` to `/path/index.html`.

## Dependency notes

- `npm audit` reports development-only findings through `eslint-config-next`;
  production dependencies pass `npm audit --omit=dev`. Re-check when updating.
- `serve` (used by `npm run preview`) has a scoped `compression` override; remove
  it once `serve` ships the patched dependency.
- Some bundled lint plugins still declare ESLint 9 peer ranges, so npm prints
  peer warnings on install; linting works as configured.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [CloudFront Origin Access Control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
