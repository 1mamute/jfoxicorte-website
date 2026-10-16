# AGENTS.md

## Project

One-page Portuguese-language (pt-BR) marketing site for JF Oxicorte (laser cutting, oxy-fuel cutting and sheet-metal bending). Next.js App Router with React 19, TypeScript, Tailwind CSS v4 and shadcn/ui (Radix). `output: "export"` produces static HTML/CSS/JS in `out/`; production has no Node.js server.

For photo replacement, deployment or GA4 setup, read the corresponding section of `README.md`. The configured CI deploys to GitHub Pages; the README also documents S3 + CloudFront hosting.

## Commands

- Use Node.js >= 22.13 and npm; install dependencies with `npm ci`.
- `npm run dev` — runs `scripts/dev.mjs`: builds photos, watches `assets-src/photos/`, then starts `next dev` (localhost:3000). Use this entry point so photo and caption changes are picked up.
- `npm run build` — static export to `out/`; `prebuild` generates photos first.
- `npm run check` — lint (`--max-warnings=0`), `prettier --check`, and `next typegen && tsc --noEmit`. The typecheck lifecycle generates photos before resolving the imported manifest. Run before committing; also run `npm run build` for application changes and before deploying.
- `npm run lint:fix` / `npm run format` — autofix lint / prettier (includes Tailwind class ordering).
- `npm run images` — regenerate photo variants; `npm run icons` — regenerate favicon/app icons from `assets-src/brand/logo-mark.svg`.
- `npm run preview` — builds first via `prepreview`, then serves `out/`.

There is no automated test suite. For documentation-only changes, check formatting on the edited files with the locally installed Prettier.

## Architecture

- Copy (navigation, services, materials, gallery titles, FAQ) lives in `src/content/home.ts`; business data and contact channels in `src/config/site.ts`; visual feature switches in `src/config/appearance.ts`; GA4 configuration in `src/config/analytics.ts`. These values are read at build time — rebuild after editing.
- Section components in `src/components/sections/` are composed in `src/app/page.tsx`. Shared site components live in `src/components/site/`; shadcn/ui primitives in `src/components/ui/`.
- `src/app/layout.tsx` owns metadata, LocalBusiness JSON-LD, the shared icon sprite, contact notice and analytics integration. Keep business data sourced from `site.ts` so visible content and structured data agree.

## Contacts, URLs and static export

- Use `ContactLink` with the `whatsapp`, `phone`, `email` or `instagram` channel. `contactHref` centralizes destinations; the optional `service` supplies the service-specific WhatsApp message. The landline uses `tel:` independently of WhatsApp.
- Contacts are validated at module load: a filled but malformed value fails the build. An empty channel falls back to `#contato`; the shared `ContactNotice` dialog explains that it is "em atualização" when JS is available. Preserve this fallback and its focus restoration.
- `SITE_URL` overrides `site.url`, whose default is `https://jfoxicorte.com.br`. A nonempty invalid/non-HTTPS value fails the build. An explicitly empty value makes `siteOrigin` null and omits canonical, absolute Open Graph URLs and sitemap entries.
- `BASE_PATH` configures sub-path hosting (e.g. `/repo`); `next.config.ts` exposes it as `NEXT_PUBLIC_BASE_PATH`. Use `basePath`/`siteBase` from `site.ts` for asset and absolute URLs so photos, icons, metadata and the manifest work on GitHub Pages project sites.
- Keep `trailingSlash: true`, `images.unoptimized: true` and metadata routes (`robots.ts`, `sitemap.ts`, `manifest.ts`) statically exportable. Photos use plain `<img>` with pipeline-generated responsive `srcSet`. Features must work without a request-time server; consult the bundled static-export guide before adding routing or data APIs.

## Photos and brand assets

- Edit originals in `assets-src/photos/`: `hero/1.ext`, numbered `services/N.ext` in service order, and `gallery/<id>/N.ext`. Each gallery photo needs `N.json` containing only a nonempty `text` string. Hero/service alt text stays in `hero.tsx`/`home.ts`; gallery alt text combines its title and photo text.
- Gallery folder names must match `galleries` IDs in `home.ts`, and `services/` needs exactly one photo per service. Layout or caption errors fail generation/build with the relevant path.
- `scripts/images.mjs` generates hashed WebP variants up to 1600px, blurred previews and `public/og-image.jpg`; `src/lib/photos.generated.json` feeds `src/lib/images.ts`. These outputs and `public/images/` are git-ignored: commit originals and captions, regenerate outputs instead of editing them.
- Transparent originals are placeholders and render skeletons; use opaque real photos. EXIF rotation is applied and metadata is stripped by the pipeline. See `README.md` for supported formats and photo preparation.
- After editing `assets-src/brand/logo-mark.svg`, run `npm run icons` and commit the generated favicon/app icons. Unlike generated photos, those icon outputs are tracked.

## UI behavior

- `appearance.ts` computes `finish`, set as `data-finish` on `<html>`; `globals.css` selects variants with `:root[data-finish~="brushed"]`, `"bevel"`, etc. Add finish toggles through this mechanism.
- `globals.css` replaces Tailwind's default breakpoints: `xs` 481, `sm` 700, `md` 801 (desktop navigation), `lg` 1101 and `xl` 1600px. Preserve the mobile-first layout and the single dark palette exposed as `@theme` tokens (`ink`, `page`, `steel`, `graphite`, etc.).
- Sections use viewport slides and scroll-snap targets; `--slide-h` accounts for the sticky header and mobile viewport. Coordinate section sizing and header changes through the shared CSS variables.
- Preserve usable content, links, native FAQ `<details>` and the services CSS scroll-snap row without JS. JS enhances the mobile menu, gallery carousels (Embla), lightbox (Radix Dialog), contact notice and floating WhatsApp offset. Motion must respect `prefers-reduced-motion`.

## Analytics

- `GA_MEASUREMENT_ID` is a public build-time GA4 ID validated in `src/config/analytics.ts`. Empty disables analytics; a malformed nonempty ID fails the build. `layout.tsx` mounts `GoogleAnalytics` only in production with an ID. A production preview with an ID also collects events.
- `src/components/site/google-analytics.tsx` delegates clicks on links, buttons and FAQ summaries to `button_click`. Preserve `button_name`, `button_location` and optional `contact_channel`/`service_name`; use `data-analytics-name` and `data-analytics-location` when visible labels or DOM context are insufficient. `ContactLink` supplies channel/service attributes.
- Send only interface labels and context in custom parameters. Keep contact URLs, WhatsApp messages and visitor input out of event payloads. Keep one GA4 integration to avoid duplicate collection.
- For GA4 property setup, custom dimensions and live verification, read the Google Analytics section in `README.md`. A successful build alone cannot confirm collection in the real property.

## Deployment

`.github/workflows/deploy.yml` checks and exports the site on pushes to `main` or manual runs, then publishes `out/` to GitHub Pages. It obtains `SITE_URL`/`BASE_PATH` from `actions/configure-pages` and `GA_MEASUREMENT_ID` from the repository variable. For S3 + CloudFront, follow the README's cache/upload order and invalidation instructions.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
