# Website final review

Reviewed locally on 2026-10-19. Scope: preserve the Portuguese marketing content,
branding, palette, section layout, contact channels and static hosting model.

## Changes made

| Area                    | Finding and resolution                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security                | Upgraded Sharp from 0.34.5 to 0.35.5, resolving its reported native-library vulnerabilities. Regenerated the photo cache with the updated encoder. Production dependency audit passes.                                                                                                                                    |
| Deployment security     | Restricted the build job to read permissions. Only the deployment job receives Pages write and OIDC permissions.                                                                                                                                                                                                          |
| Privacy                 | Global Privacy Control or Do Not Track prevents both loading Google's script and collecting delegated click events.                                                                                                                                                                                                       |
| Privacy                 | GA4 configuration sends the page URL without query strings or fragments, and sends only the referring origin. Explicitly set the document's referrer policy to `strict-origin-when-cross-origin`.                                                                                                                         |
| Accessibility           | The mobile menu closes when keyboard focus moves outside it, in addition to its existing Escape and pointer behavior.                                                                                                                                                                                                     |
| Progressive enhancement | Gallery photos are native links, and their rows support native horizontal scrolling before enhancement. Without JavaScript, every photo remains reachable and enlargement links work; inactive carousel controls are omitted.                                                                                             |
| SEO                     | Gallery thumbnail images now have descriptive alternative text derived from the existing gallery titles and captions.                                                                                                                                                                                                     |
| Performance             | Off-screen lightbox photos use lazy loading; the selected photo remains eager. No speedup is claimed without field measurements.                                                                                                                                                                                          |
| Responsiveness          | Reserved more vertical space for the lightbox controls on short screens. Its close button was partly above the viewport at 844×390 and 667×320; it now fits fully. Normal desktop and portrait layouts retain their existing sizing.                                                                                      |
| Regression prevention   | Added `npm run check:export` and run it in CI after the build, before uploading the Pages artifact. It checks actual HTML, asset paths, anchor targets, image descriptions and dimensions, business schema, canonical/sitemap/social URLs, error-page indexing, and accidental source-map or private build-file exposure. |

## Verification

- `npm run check`: ESLint, Prettier and TypeScript pass.
- Production static builds and `npm run check:export` pass for the default domain,
  an HTTPS origin with `/review` as the hosting sub-path, and an explicitly empty
  `SITE_URL`.
- `npm audit --omit=dev` reports no vulnerabilities after the dependency update.
- Chrome checks covered 320×568, 360×640, 390×844, 480×800, 481×800, 699×900,
  700×900, 800×900, 801×900, 1024×768, 1101×800, 1440×900, 1920×1080 and
  844×390. No document overflow or unexpectedly clipped text/control boxes was
  detected. The lightbox also passed at 667×320.
- Axe checks against WCAG 2 A/AA, 2.1 AA and 2.2 AA rules found no violations in
  the tested desktop/mobile home and lightbox states. This is an automated scan,
  not a full accessibility conformance assessment.
- Verified mobile-menu Escape and focus exit, lightbox navigation and focus
  restoration, contact-notice focus restoration, native FAQ expansion, and
  reduced-motion scrolling settings.
- Verified that galleries remain scrollable, all photo links remain available,
  and photos open without JavaScript. Native FAQ expansion also works without it.
- Analytics checks used a fake measurement ID and intercepted Google requests.
  Normal browsing queues one initialization and labeled click events; GPC and
  DNT browsing queues none and makes no Google script request. The analytics-off
  production build made no third-party requests during the tested interactions.
- Inspected desktop, mobile-gallery and landscape-lightbox screenshots.
- Verified all 63 exported photo variants omit EXIF, XMP and IPTC metadata.
- `git diff --check` passes. No deployment or remote workflow run was performed.

## Remaining limits and follow-up

1. **Development dependency advisory:** `npm audit` still reports five high
   findings in one lint-tool dependency chain rooted in `braces`. The
   [upstream advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no
   patched release at review time. This chain processes repository patterns
   during development and is absent from the exported website. Downgrading
   Next.js to satisfy npm's proposed resolution would be inappropriate.
2. **Existing GA4 properties:** follow the updated README to disable optional
   enhanced-measurement events other than scrolling, and disable history-based
   page views. In particular, automatic outbound clicks include `link_url`, and
   site-search measurement can include query terms; these operate outside the
   site's delegated event payload. These property settings were not accessible
   during this review. See Google's
   [enhanced-measurement reference](https://support.google.com/analytics/answer/9216061?hl=en).
3. **Analytics tradeoffs:** stripping the page query also removes campaign
   parameters from the reported page URL. GA4 still uses cookies for visitors
   without an opt-out signal, and the site has no consent-choice interface.
   Browser privacy signals do not replace such an interface. No consent UI was
   introduced in this review's design-preserving scope. URL overrides follow
   Google's [configuration reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/config).
4. **Deployment validation:** real GA4 collection, production response headers,
   TLS, redirects and CDN caching were not verified against the deployed host.
   Server security headers require hosting configuration; Next.js `headers()`
   does not apply to a static export. The README documents CloudFront settings.
5. **Browser coverage:** interaction and visual checks used desktop Chrome with
   emulated viewport sizes, not physical phones, Safari or Firefox. Real-user
   Core Web Vitals and a screen-reader review remain outside these local checks.

The recurring export checks can be rerun with:

```sh
npm run check
npm run build
npm run check:export
npm audit --omit=dev
```
