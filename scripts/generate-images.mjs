// Generates the optimized images used by the site from the originals in
// assets-src/. Run `npm run images` after replacing or adding a photo, then
// commit the generated files (the build itself does not resize images).
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "assets-src", ...p);
const pub = (...p) => path.join(root, "public", ...p);
const app = (...p) => path.join(root, "src", "app", ...p);

// Must match PHOTO_WIDTHS in src/lib/images.ts.
const PHOTO_WIDTHS = [480, 800, 1200, 1600];
const PHOTO_QUALITY = 72;

async function photos() {
  await fs.mkdir(pub("images"), { recursive: true });
  const files = (await fs.readdir(src("photos"))).filter((f) =>
    /\.(webp|jpe?g|png|avif)$/i.test(f),
  );
  for (const file of files) {
    const name = path.parse(file).name;
    const input = sharp(src("photos", file));
    const { width = 0, height = 0 } = await input.metadata();
    // Widths larger than the original are skipped; the original width is
    // always emitted so the largest candidate is never upscaled.
    const widths = [
      ...new Set([
        ...PHOTO_WIDTHS.filter((w) => w < width),
        Math.min(width, 1600),
      ]),
    ];
    for (const w of widths) {
      const out = pub("images", `${name}-${w}.webp`);
      await input
        .clone()
        .resize({ width: w })
        .webp({ quality: PHOTO_QUALITY, effort: 6 })
        .toFile(out);
    }
    console.log(`${file}: ${width}x${height} -> ${widths.join(", ")}`);
  }
}

async function brand() {
  const svg = await fs.readFile(src("brand", "logo-mark.svg"), "utf8");
  const light = svg.replace(/fill="#[0-9a-f]+"/i, 'fill="#f0f0f0"');

  // Favicon follows the browser theme: dark mark on light UI and vice versa.
  const adaptive = svg
    .replace(/fill="#[0-9a-f]+"/i, "")
    .replace(
      /<path/,
      "<style>path{fill:#111}@media (prefers-color-scheme:dark){path{fill:#f0f0f0}}</style><path",
    );
  await fs.writeFile(app("icon.svg"), adaptive);

  // Raster icons: light mark on the site's dark surface, with safe padding.
  const tile = async (size, pad) => {
    const inner = Math.round(size * (1 - pad * 2));
    const mark = await sharp(Buffer.from(light), { density: 1200 })
      .resize(inner, inner)
      .png()
      .toBuffer();
    return sharp({
      create: { width: size, height: size, channels: 4, background: "#101112" },
    })
      .composite([{ input: mark, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };
  await fs.writeFile(app("apple-icon.png"), await tile(180, 0.14));
  await fs.writeFile(pub("icon-192.png"), await tile(192, 0.14));
  await fs.writeFile(pub("icon-512.png"), await tile(512, 0.14));
  await fs.writeFile(pub("icon-maskable-512.png"), await tile(512, 0.22));

  // favicon.ico with PNG payloads (16, 32, 48) for legacy user agents.
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => tile(s, 0.06)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(s, e);
    header.writeUInt8(s, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(pngs[i].length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += pngs[i].length;
  });
  await fs.writeFile(app("favicon.ico"), Buffer.concat([header, ...pngs]));

  // Open Graph / social preview: 1200x630 hero crop with the brand lockup.
  const markSize = 150;
  const mark = await sharp(Buffer.from(light), { density: 1200 })
    .resize(markSize, markSize)
    .png()
    .toBuffer();
  const overlay =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#151515" stop-opacity=".95"/><stop offset=".55" stop-color="#151515" stop-opacity=".55"/><stop offset="1" stop-color="#151515" stop-opacity=".1"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" letter-spacing="-3" fill="#f0f0f0">Seu projeto ganha</text>
    <text x="80" y="415" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" letter-spacing="-3" fill="#f0f0f0">forma no aço.</text>
    <text x="80" y="480" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#c3c3c3">Corte a laser, oxicorte e dobra de chapas</text>
    <text x="245" y="200" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" fill="#f0f0f0">JF OXICORTE</text>
  </svg>`);
  await sharp(src("photos", "laser.webp"))
    .flatten({ background: "#2e3134" }) // transparent placeholder -> solid
    .resize(1200, 630, { fit: "cover", position: "right" })
    .modulate({ brightness: 0.7 })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: mark, left: 80, top: 85 },
    ])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(pub("og-image.jpg"));
  console.log("brand icons and og-image.jpg generated");
}

await photos();
await brand();
