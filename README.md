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

| Command            | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev`      | Development server with hot reload.                              |
| `npm run build`    | Production build, exported to `out/`.                            |
| `npm run preview`  | Serve `out/` locally (build first).                              |
| `npm run images`   | Regenerate the responsive images from `assets-src/` (see below). |
| `npm run check`    | Lint (warnings fail), formatting and strict type checks.         |
| `npm run format`   | Format code and docs, including Tailwind class ordering.         |
| `npm run lint:fix` | Fix lint issues where possible.                                  |

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
- **Photos** — `assets-src/photos/` holds blank placeholders (same sizes as the
  final crops). Replace them with real work photos and run `npm run images`.

Page copy (services, materials, galleries, FAQ, navigation) is in
[`src/content/home.ts`](src/content/home.ts).

## Images

Originals live in `assets-src/photos/` (and the brand files in
`assets-src/brand/`). `npm run images` writes WebP variants at 480/800/1200/1600px
to `public/images/<name>-<width>.webp`, plus the icons and the Open Graph image.
Commit the generated files; the build does not resize images (Next.js image
optimization needs a server).

To add or replace a photo: put the original in `assets-src/photos/`, run
`npm run images`, then register its intrinsic size in
[`src/lib/images.ts`](src/lib/images.ts) so `width`/`height` and `srcset` stay
correct (prevents layout shift).

## Project layout

```text
assets-src/               Original photos and brand files (not deployed)
scripts/                  Image generation script
public/                   Files copied as-is to the export (images, icons, OG image)
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

# Fingerprinted assets: cache for a year.
aws s3 sync out/_next/static s3://BUCKET/_next/static \
  --cache-control "public, max-age=31536000, immutable"

# Everything else (HTML, images, icons, robots, sitemap, manifest): revalidate.
aws s3 sync out s3://BUCKET --delete --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

Upload `_next/static` first so new HTML never references missing assets. Images
in `public/images/` keep stable names, so they use the revalidating policy.
Change the file name if you want them cached as immutable.

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
