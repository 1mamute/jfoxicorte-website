# JF Oxicorte website

One-page Portuguese-language (pt-BR) marketing website for JF Oxicorte, covering
laser cutting, oxy-fuel cutting and sheet-metal bending. Built with Next.js App
Router, React 19, TypeScript, Tailwind CSS v4 and shadcn/ui (Radix).

The project exports static HTML, CSS and JavaScript to `out/`. Production hosting
does not require a Node.js server. The included workflow deploys to GitHub Pages;
S3 + CloudFront is also supported.

## Getting started

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. The development command generates photos, watches
originals and captions for changes, and starts the Next.js development server.

## Commands

| Command                | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Start development with hot reload and photo watching.      |
| `npm run build`        | Generate photos and export the production site to `out/`.  |
| `npm run preview`      | Build the production site, then serve `out/` locally.      |
| `npm run images`       | Generate photo variants from `assets-src/photos/`.         |
| `npm run icons`        | Regenerate the favicon and app icons from the logo.        |
| `npm run check`        | Run lint, formatting and TypeScript checks.                |
| `npm run check:export` | Validate the exported site after a build.                  |
| `npm run format`       | Format code and documentation, including Tailwind classes. |
| `npm run lint:fix`     | Fix lint issues where possible.                            |

Before deploying, run:

```sh
npm run check
npm run build
npm run check:export
```

The export check validates local assets, anchor targets, photo descriptions and
dimensions, canonical and social URLs, sitemap entries, error-page indexing and
accidental exposure of source maps or private build files. It supports sub-path
hosting and builds with an explicitly empty `SITE_URL`.

## Configuration

Configuration and content are read at build time. Rebuild after changing them.

| File                                                   | Contents                                            |
| ------------------------------------------------------ | --------------------------------------------------- |
| [`src/config/site.ts`](src/config/site.ts)             | Business details, contact channels and default URL. |
| [`src/content/home.ts`](src/content/home.ts)           | Navigation, services, materials, galleries and FAQ. |
| [`src/config/appearance.ts`](src/config/appearance.ts) | Visual finish switches.                             |
| [`src/config/analytics.ts`](src/config/analytics.ts)   | GA4 measurement ID validation.                      |

### Business details and contacts

Edit `site.ts` to configure the business address, service area, opening hours and
Google Maps place ID. These values feed the visible page, map link and
LocalBusiness structured data.

Contact fields are `whatsapp`, `telephone`, `email` and `instagram`. Phone numbers
use country code `55`, area code and number; Instagram uses a full HTTPS URL.
The landline has its own click-to-call link, separate from WhatsApp.

A malformed nonempty contact value fails the build. An empty channel links to the
contact section and, when JavaScript is available, opens an unavailable-contact
notice. An empty email uses a placeholder in the contact section.

### Build environment

Set variables in the build environment or an appropriate Next.js `.env` file.

| Variable            | Behavior                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `SITE_URL`          | Overrides the HTTPS origin in `site.ts`. If unset, uses the configured project domain. Invalid nonempty values fail the build. |
| `BASE_PATH`         | Hosting sub-path, such as `/repository`. Leave unset or empty when hosting at the domain root.                                 |
| `GA_MEASUREMENT_ID` | Public GA4 ID, such as `G-XXXXXXXXXX`. Unset or empty disables analytics; invalid nonempty values fail the build.              |

An explicitly empty `SITE_URL` omits canonical URLs, absolute Open Graph URLs,
sitemap entries and the sitemap reference in `robots.txt`.

For example, create `.env.production` for a custom-domain build:

```dotenv
SITE_URL=https://www.example.com
BASE_PATH=
GA_MEASUREMENT_ID=
```

`BASE_PATH` is exposed internally as `NEXT_PUBLIC_BASE_PATH`. Use `basePath` and
`siteBase` from `site.ts` when building asset or absolute URLs.

## Photos and brand assets

### Add or replace photos

Store originals in `assets-src/photos/`. Supported formats are JPEG, PNG, WebP
and AVIF; convert HEIC files to JPEG first.

```text
assets-src/photos/
  hero/1.jpg             Hero background and Open Graph image
  services/1.jpg         Service cards, in home.ts service order
  gallery/<id>/1.jpg     Gallery photos, displayed in numeric order
  gallery/<id>/1.json    Caption for the matching photo
```

- The hero uses `1` as its filename. Services need exactly one numbered photo per
  service. Their alt text lives in `hero.tsx` and `home.ts`; they have no caption
  JSON files.
- Gallery folder names must match the `galleries` IDs in `home.ts`. Each photo
  needs a matching JSON file containing only a nonempty `text` string. Write
  captions in pt-BR to match the site. Gallery alt text combines the gallery title
  and caption.
- Keep subjects centered because photos are cropped from the center. Use opaque
  photos; transparent originals are treated as placeholders and show skeletons.

A caption file has this structure (translate the sample text to pt-BR):

```json
{ "text": "Description of the work shown" }
```

Update and commit originals and captions to add, replace or remove photos. To add
a gallery, also add its entry to `galleries` in `home.ts`. `npm run dev` watches
for changes; `npm run build` and the typecheck step in `npm run check` also
regenerate photos automatically. Invalid filenames, captions or folder layouts
fail generation with the relevant path.

### Generated files and icons

[`scripts/images.mjs`](scripts/images.mjs) applies EXIF rotation, strips metadata
(including GPS), and generates hashed WebP variants up to 1600px wide, plus
blurred previews and the Open Graph image. Unchanged photos are skipped and
outdated variants are removed. The pipeline warns about placeholders and photos
narrower than 1600px.

Generated outputs are ignored by Git; regenerate them instead of editing them:

- `public/images/`: responsive photo variants.
- `public/og-image.jpg`: social sharing image.
- `src/lib/photos.generated.json`: dimensions, variants, captions and previews,
  consumed by `src/lib/images.ts`.

To update the favicon and app icons, edit `assets-src/brand/logo-mark.svg` and run
`npm run icons`. Commit the generated icons; unlike generated photos, they are
tracked.

## Project structure

```text
assets-src/               Original photos and brand assets
scripts/                  Photo pipeline, icons, dev runner and export checks
public/                   Static files copied to the export
src/app/                  Layout, page, 404 and metadata routes
src/components/sections/  Hero, about, services, materials, projects, FAQ, contact
src/components/site/      Header, footer, menu, contact links, icons and analytics
src/components/ui/        shadcn/ui primitives
src/config/               Business, appearance and analytics configuration
src/content/              Page copy
src/lib/                  Shared utilities and generated photo manifest
```

The layout is mobile-first, with breakpoints at 481, 700, 801 (desktop
navigation), 1101 and 1600px. Sections use viewport sizing and scroll snapping
below the sticky header. Visual finishes use `appearance.ts` and `data-finish`
on `<html>`.

Content, links, native FAQ `<details>` and the services scroll-snap row remain
usable without JavaScript. JavaScript adds the mobile menu, gallery carousels,
lightbox, contact notice and floating WhatsApp offset. Motion respects
`prefers-reduced-motion`.

Keep features compatible with static export: production has no request-time
server. The configuration uses `output: "export"`, `trailingSlash: true` and
`images.unoptimized: true`; photos use pipeline-generated responsive variants.

## Deploy to GitHub Pages

1. In the repository, open **Settings → Pages** and select **GitHub Actions** as
   the source.
2. Push to `main`, or run **Deploy to GitHub Pages** manually from **Actions**.

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs
dependencies, runs `npm run check`, builds, validates the export and publishes
`out/`. It obtains `SITE_URL` and `BASE_PATH` from `actions/configure-pages`, and
`GA_MEASUREMENT_ID` from the repository variable of the same name.

Project sites use a sub-path such as `https://<account>.github.io/<repository>/`.
`BASE_PATH` handles scripts, styles, photos, icons and the manifest. Configuring a
custom domain in Pages settings updates the origin and base path on the next run.

To build for a sub-path locally, set these values in `.env.production` and run
`npm run build`:

```dotenv
SITE_URL=https://<account>.github.io
BASE_PATH=/<repository>
```

## Google Analytics 4

Analytics runs in the browser on static hosting. It loads only in production
builds with a configured `GA_MEASUREMENT_ID`; `npm run dev` does not collect data.
A local production preview with an ID does collect data.

### Set up collection

1. In [Google Analytics](https://analytics.google.com/), create a GA4 property
   with the business reporting time zone and currency, then create a web data
   stream for the public site URL.
2. In **Enhanced measurement**, enable scrolls and disable the other optional
   events, including outbound clicks, site search, downloads, video and forms.
   The site's `button_click` event tracks its controls without sending contact
   URLs. In the advanced page-view settings, disable history-based page views so
   anchor navigation does not count as another page view.
3. Copy the measurement ID (`G-XXXXXXXXXX`), rather than the numeric property ID
   or a `GTM-` container ID.
4. For GitHub Pages, add `GA_MEASUREMENT_ID` under **Settings → Secrets and
   variables → Actions → Variables**. For other hosts, set it in the build
   environment or an appropriate `.env` file. The ID is public and included in
   the exported files.
5. Rebuild and deploy. A new build is required to enable, change or remove the ID.
   Keep a single GA4 integration to avoid duplicate collection.

### Analyze clicks and engagement

The `button_click` event tracks links, buttons and FAQ summaries, including
menu and gallery controls. It records interface labels and context rather than
contact URLs, WhatsApp messages or visitor input.

Create these custom dimensions with **Event** scope under **Admin → Data display
→ Custom definitions**:

| Dimension         | Event parameter   |
| ----------------- | ----------------- |
| Button name       | `button_name`     |
| Button location   | `button_location` |
| Contact channel   | `contact_channel` |
| Requested service | `service_name`    |

In **Explore**, filter the event name to `button_click`, use button name and
location as rows, and event count as the value. Sort by event count to rank
controls. Contact links report the channel; service quote links report the
service. A WhatsApp click indicates contact intent, not a sent message or sale.

Use date and total users for daily visitor reporting, average engagement time
per session for active browsing time, and acquisition and technology reports for
traffic sources and devices. User counts represent browser identities rather
than an exact count of people.

### Verify collection

After deployment, open the site without an ad blocker, navigate and click some
controls. Check **Reports → Realtime** for `page_view` and `button_click`. Use
[Google Tag Assistant](https://tagassistant.google.com/) and **DebugView** to
inspect parameters. Processed reports and custom dimensions may take 24–48 hours
to appear. A successful build alone cannot confirm collection in the property.

The integration disables Google Signals and ad personalization. It does not load
when Global Privacy Control is enabled. The legacy Do Not Track signal does not
disable analytics. GA4 uses cookies; this project does not include a consent
interface.

Page URLs sent to GA4 exclude query parameters and fragments, including campaign
parameters. Referrers include only the origin. Keep Enhanced measurement
outbound clicks disabled, including in existing properties, because its automatic
`click` event includes destination URLs.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [CloudFront Origin Access Control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [GA4 property and web stream setup](https://support.google.com/analytics/answer/14183469?hl=en)
- [GA4 engagement time](https://support.google.com/analytics/answer/11109416?hl=en)
- [GA4 custom dimensions](https://support.google.com/analytics/answer/14240153?hl=en)
- [GA4 enhanced measurement](https://support.google.com/analytics/answer/9216061?hl=en)
