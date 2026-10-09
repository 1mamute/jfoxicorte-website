# JFOxicorte website

Static landing-page starter built with Next.js App Router, React, TypeScript,
Tailwind CSS v4, and shadcn/ui (New York style with Radix primitives).

## Getting started

Use Node.js 22.13 or newer and npm. Node.js 24 LTS is recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit `src/app/page.tsx` to replace the Portuguese
placeholder page with the landing-page content.

## Commands

| Command                | Purpose                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`          | Start the development server with hot reload.                                  |
| `npm run build`        | Build the production site and export it to `out/`.                             |
| `npm run preview`      | Serve the exported `out/` directory locally (build first).                     |
| `npm run lint`         | Check Next.js, React, accessibility, and TypeScript lint rules; warnings fail. |
| `npm run lint:fix`     | Fix lint issues where possible.                                                |
| `npm run format`       | Format source and documentation, including Tailwind class ordering.            |
| `npm run format:check` | Check formatting without changing files.                                       |
| `npm run typecheck`    | Generate Next.js route types and run strict TypeScript checks.                 |
| `npm run check`        | Run lint, formatting, and type checks.                                         |

Before submitting changes, run `npm run check` and `npm run build`. Linting is a
separate check from the production build.

## Project layout

```text
public/                   Static assets copied to the export
src/app/globals.css       Tailwind imports and shadcn theme tokens
src/app/layout.tsx        Root document, language, and metadata
src/app/page.tsx          Home page
src/components/ui/        Editable shadcn/ui component source
src/lib/utils.ts          cn() helper for merging class names
components.json           shadcn CLI configuration and import aliases
next.config.ts            Static export configuration
eslint.config.mjs         ESLint flat configuration
.prettierrc.json          Prettier and Tailwind class sorting
```

The `@/` import alias resolves to `src/`. TypeScript strict mode is enabled.
ESLint uses Next.js Core Web Vitals and TypeScript rules, with
`eslint-config-prettier` to avoid formatting conflicts. `.editorconfig` defines
UTF-8, LF line endings, and two-space indentation.

## UI components and styling

`Button` is included and used on the home page. shadcn/ui components live in the
repository and can be customized directly. Add more components with:

```sh
npx shadcn@latest add card
```

Review generated changes, then run `npm run format` and `npm run check`.
Configuration uses `src/app/globals.css` and the `@/components/ui` alias.
Tailwind v4 uses its PostCSS plugin and CSS configuration, so there is no
`tailwind.config.ts`. Theme colors and radii are CSS variables in `globals.css`.
Dark tokens are available by adding the `dark` class to the root element; a theme
switcher is not included. System fonts keep builds independent of font downloads.

## Static export and hosting

```sh
npm run check
npm run build
npm run preview
```

`next.config.ts` sets `output: "export"`, `trailingSlash: true`, and
`images.unoptimized: true`. The build generates HTML, CSS, JavaScript, and static
assets in `out/`, including `out/index.html` and `out/404.html`.

Deploy the contents of `out/` to a static host. Configure the host to serve
directory `index.html` files and use `404.html` for missing routes. No Node.js
server is required in production; `next start` is not used for exported sites.
If hosting below a subpath, configure Next.js `basePath` before building.

Static exports require all pages to be known at build time. Dynamic routes need
`generateStaticParams()`. Request-time cookies, Server Actions, ISR, and runtime
API endpoints require a server and are unsuitable for this configuration. Data
can be loaded at build time or fetched from an external API in the browser.
The default Next.js image optimization service requires a server, so this
starter exports unoptimized images; resize and compress assets before adding them.

Files in `public/` are referenced from the site root (for example `/logo.svg`).
Only public values should use `NEXT_PUBLIC_` environment variables; they are
embedded in browser assets at build time. Never include secrets in the export.
Generated output, dependencies, and local environment files are ignored by Git.

## Dependency audit

The initial dependency audit reports five high-severity development-tooling
findings through `eslint-config-next` → `fast-glob` → `micromatch` → `braces`.
The registry currently has no patched `braces` release for the reported issue.
Track upstream fixes and rerun `npm audit` when updating dependencies. Production
dependencies pass `npm audit --omit=dev`.

The `serve` dependency has a scoped `compression` override to use the patched
1.8.2 release. Remove the override when `serve` updates its dependency.

ESLint 10 is supported by Next.js, but some bundled lint plugins still declare
ESLint 9 peer ranges. npm reports peer warnings during installation; the
lockfile installs successfully and the configured lint rules are checked with
`npm run lint`.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [shadcn/ui installation](https://ui.shadcn.com/docs/installation/next)
