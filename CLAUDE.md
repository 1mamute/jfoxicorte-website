# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

One-page Portuguese-language (pt-BR) marketing site for JF Oxicorte (laser/oxy-fuel cutting, sheet-metal bending). Next.js App Router with `output: "export"` (static HTML in `out/`, hosted on S3 + CloudFront; no server at runtime), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix). README.md has the full deploy and photo-pipeline docs.

## Commands

- `npm run dev` — runs `scripts/dev.mjs`: builds photos, watches `assets-src/photos/`, then starts `next dev` (localhost:3000). Use this instead of `next dev` directly or new photos won't be picked up.
- `npm run build` — static export to `out/` (`prebuild` runs `npm run images`). Set `SITE_URL` to override the canonical origin.
- `npm run check` — lint (`--max-warnings=0`), `prettier --check`, and `next typegen && tsc --noEmit`. Run before committing.
- `npm run lint:fix` / `npm run format` — autofix lint / prettier (includes Tailwind class ordering).
- `npm run images` — regenerate photo variants; `npm run icons` — regenerate favicon/app icons from `assets-src/brand/logo-mark.svg`.
- `npm run preview` — serve `out/` (builds first).

There is no test suite. Requires Node >= 22.13.

## Architecture

- **Content vs. config vs. components**: copy (nav, services, materials, gallery titles, FAQ) lives in `src/content/home.ts`; business data and contact channels in `src/config/site.ts`; visual feature switches in `src/config/appearance.ts`. Section components in `src/components/sections/` are composed in `src/app/page.tsx`. All of this is read at build time — rebuild after editing.
- **Contact channels** (`site.ts`): WhatsApp/email/Instagram are validated at module load; a filled-but-malformed value throws and fails the build, an empty one makes `ContactLink` open an "em atualização" notice instead of a fake link. `siteOrigin` is null when no valid HTTPS URL, which drops canonical/og/sitemap URLs.
- **Photo pipeline**: originals in `assets-src/photos/{hero,services,gallery/<id>}/N.ext` (+ `N.json` with `{ "text" }` for gallery photos) → `scripts/images.mjs` → hashed WebP variants in `public/images/` and `src/lib/photos.generated.json`, consumed by `src/lib/images.ts`. Generated outputs (`public/images/`, `public/og-image.jpg`, the manifest) are git-ignored; only originals are committed. Gallery folder names must match `id`s in `galleries` in `home.ts`, and `services/` needs exactly one photo per service — violations fail with a message naming the file. Transparent images are treated as placeholders and render a skeleton.
- **Appearance switches**: `appearance.ts` computes a `finish` string set as `data-finish` on `<html>`; `globals.css` styles variants via `:root[data-finish~="brushed"]` / `"bevel"`. Add new finish toggles through this mechanism rather than ad-hoc classes.
- **Layout system** (`globals.css`): custom mobile-first breakpoints (`xs` 481, `sm` 700, `md` 801 = desktop nav, `lg` 1101, `xl` 1600 px — these replace Tailwind's defaults). Each section is a full-viewport "slide" (`--slide-h` = viewport minus sticky header) and a scroll-snap target. Palette is a single dark theme exposed as `@theme` tokens (`ink`, `page`, `steel`, `graphite`, …).
- **Progressive enhancement**: the page must work without JS — FAQ is `<details>`, the services row is CSS scroll-snap. JS only adds the mobile menu, gallery carousels (Embla) and lightbox (Radix Dialog), the contact notice, and floating WhatsApp offset. Respect `prefers-reduced-motion`.
- **Static-export constraints**: `images.unoptimized: true` (no `next/image` optimization — responsive `srcSet` comes from the pipeline), `trailingSlash: true`, metadata routes (`robots.ts`, `sitemap.ts`, `manifest.ts`) must be statically exportable.
