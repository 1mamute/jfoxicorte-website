// Generates the favicon, app icons and PWA icons from
// assets-src/brand/logo-mark.svg. Run `npm run icons` after changing the logo,
// then commit the outputs (photos are handled by scripts/images.mjs).
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "assets-src", ...p);
const pub = (...p) => path.join(root, "public", ...p);
const app = (...p) => path.join(root, "src", "app", ...p);

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
  console.log("brand icons generated");
}

await brand();
