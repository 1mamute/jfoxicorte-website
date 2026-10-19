import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "../out");
assert(fs.existsSync(path.join(out, "index.html")), "Run npm run build first.");

const read = (file) => fs.readFileSync(path.join(out, file), "utf8");
const manifest = JSON.parse(read("manifest.webmanifest"));
const basePath = manifest.start_url.replace(/\/$/, "");
const home = read("index.html");
const tags = (html) =>
  [
    ...html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi),
  ].map(([, name, attributes]) => ({ name: name.toLowerCase(), attributes }));
const attr = (tag, name) =>
  tag.attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];

function checkAsset(value, file) {
  if (!value || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(value)) return;
  const pathname = value.split(/[?#]/)[0];
  assert(
    pathname.startsWith(`${basePath}/`),
    `${file}: asset does not include the base path: ${value}`,
  );
  const relative = decodeURIComponent(pathname.slice(basePath.length + 1));
  const resolved = path.resolve(out, relative);
  assert(
    resolved.startsWith(`${out}${path.sep}`),
    `${file}: invalid asset path`,
  );
  assert(fs.existsSync(resolved), `${file}: missing exported asset: ${value}`);
}

const files = fs.readdirSync(out, { recursive: true });
let pages = 0;
for (const file of files.filter((file) => file.endsWith(".html"))) {
  const html = read(file);
  const elements = tags(html);
  const ids = elements.map((tag) => attr(tag, "id")).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
  assert.equal(
    elements.filter((tag) => tag.name === "h1").length,
    1,
    `${file}: expected one h1`,
  );
  assert(html.includes('lang="pt-BR"'), `${file}: missing Portuguese language`);

  for (const tag of elements) {
    const href = attr(tag, "href");
    if (href?.startsWith("#")) {
      assert(
        ids.includes(href.slice(1)),
        `${file}: missing anchor target: ${href}`,
      );
    }
    if (attr(tag, "target") === "_blank") {
      const rel = attr(tag, "rel")?.split(/\s+/) ?? [];
      assert(
        rel.includes("noopener") && rel.includes("noreferrer"),
        `${file}: unsafe external link`,
      );
    }
    if (tag.name === "img") {
      assert(
        attr(tag, "alt")?.trim(),
        `${file}: photo needs descriptive alt text`,
      );
      assert(
        Number(attr(tag, "width")) > 0 && Number(attr(tag, "height")) > 0,
        `${file}: photo dimensions missing`,
      );
      for (const candidate of attr(tag, "srcSet")?.split(",") ?? []) {
        checkAsset(candidate.trim().split(/\s+/)[0], file);
      }
    }
    checkAsset(attr(tag, "src"), file);
    if (tag.name === "link") checkAsset(href, file);
    if (tag.name === "a" && href?.includes("/images/")) checkAsset(href, file);
  }
  const structuredData = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  assert.equal(
    structuredData.length,
    1,
    `${file}: expected one business schema`,
  );
  for (const [, json] of structuredData) {
    const data = JSON.parse(json);
    assert.equal(
      data["@type"],
      "LocalBusiness",
      `${file}: business schema missing`,
    );
    assert(data.name && data.address, `${file}: business details missing`);
  }
  if (file !== "index.html") {
    assert(
      /name="robots" content="[^"]*noindex/.test(html),
      `${file}: error page must not be indexed`,
    );
  }
  pages++;
}

for (const icon of manifest.icons) checkAsset(icon.src, "manifest.webmanifest");
const canonical = tags(home).find((tag) => attr(tag, "rel") === "canonical");
const sitemapUrls = [
  ...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => match[1]);
if (canonical) {
  const url = attr(canonical, "href");
  assert.deepEqual(sitemapUrls, [url], "Canonical URL and sitemap disagree");
  assert(
    read("robots.txt").includes(`${url}sitemap.xml`),
    "Robots sitemap URL disagrees",
  );
  const image = tags(home).find((tag) => attr(tag, "property") === "og:image");
  assert(image, "Social image metadata missing");
  assert.equal(
    attr(image, "content"),
    `${url}og-image.jpg`,
    "Social image URL disagrees",
  );
} else {
  assert.equal(
    sitemapUrls.length,
    0,
    "Unconfigured origin must omit sitemap URLs",
  );
  assert(
    !read("robots.txt").includes("Sitemap:"),
    "Unconfigured origin must omit sitemap reference",
  );
}

assert(
  !files.some((file) =>
    /(?:^|[/\\])(?:\.env[^/\\]*|package(?:-lock)?\.json)$|\.map$/.test(file),
  ),
  "Private build files or source maps were exported",
);
console.log(
  `Export verified: ${pages} HTML pages, local assets, anchors, image metadata, SEO URLs and error pages (base path: ${basePath || "/"}).`,
);
