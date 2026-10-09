// Builds the site's photos from the originals in assets-src/photos/.
//
//   node scripts/images.mjs           one-off (also runs before dev/build/typecheck)
//   node scripts/images.mjs --watch   rebuild whenever a photo is added/changed
//
// For every original it writes content-hashed WebP variants to public/images/
// and records size, variants and a blurred preview in
// src/lib/photos.generated.json (read by src/lib/images.ts). Unchanged photos
// are skipped. `hero.*` also becomes the Open Graph image (public/og-image.jpg).
// All outputs are generated, so they are git-ignored.
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const photosDir = path.join(root, "assets-src", "photos");
const outDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "src", "lib", "photos.generated.json");
const ogPath = path.join(root, "public", "og-image.jpg");
const logoPath = path.join(root, "assets-src", "brand", "logo-mark.svg");

const WIDTHS = [480, 800, 1200, 1600];
const QUALITY = 72;
// Bump when the output settings change so every photo is regenerated.
const VERSION = 1;
const SUPPORTED = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const HEIC = /\.hei[cf]$/i;
const NAME = /^[a-z0-9][a-z0-9-]*$/;

const log = (msg) => console.log(`[images] ${msg}`);

async function readManifest() {
  try {
    return JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  } catch {
    return { photos: {} };
  }
}

function listOriginals() {
  const errors = [];
  const originals = new Map();
  for (const file of fs.readdirSync(photosDir).sort()) {
    if (file.startsWith(".")) continue;
    const { name } = path.parse(file);
    if (HEIC.test(file)) {
      errors.push(`${file}: HEIC is not supported, export it as JPEG.`);
    } else if (!SUPPORTED.test(file)) {
      errors.push(`${file}: unsupported format (use JPEG, PNG, WebP or AVIF).`);
    } else if (!NAME.test(name)) {
      errors.push(
        `${file}: use lowercase letters, digits and hyphens in the name.`,
      );
    } else if (originals.has(name)) {
      errors.push(`${file}: duplicate name "${name}".`);
    } else {
      originals.set(name, path.join(photosDir, file));
    }
  }
  return { originals, errors };
}

/** Tiny preview wrapped in an SVG blur, used as a CSS background. */
async function blurPreview(input) {
  const { data, info } = await input
    .clone()
    .resize(10, 10, { fit: "inside" })
    .webp({ quality: 60 })
    .toBuffer({ resolveWithObject: true });
  const { isOpaque } = await sharp(data).stats();
  // Transparent originals are placeholders: the page shows a skeleton instead.
  if (!isOpaque) return undefined;
  const w = info.width * 40;
  const h = info.height * 40;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='20'/><feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter><image width='100%' height='100%' preserveAspectRatio='none' filter='url(#b)' href='data:image/webp;base64,${data.toString("base64")}'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function buildPhoto(name, file, hash) {
  // autoOrient applies the EXIF rotation from phones/cameras. Metadata (EXIF,
  // GPS) is not copied to the outputs.
  const input = sharp(file, { autoOrient: true });
  const meta = await input.metadata();
  const width = meta.autoOrient?.width ?? meta.width ?? 0;
  const top = Math.min(width, WIDTHS.at(-1));
  const widths = [...new Set([...WIDTHS.filter((w) => w < top), top])];

  let height = 0;
  for (const w of widths) {
    const info = await input
      .clone()
      .resize({ width: w })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(path.join(outDir, `${name}.${hash}-${w}.webp`));
    height = info.height;
  }

  const blur = await blurPreview(input);
  const notes = [];
  if (!blur) notes.push("transparent: shown as a skeleton placeholder");
  else if (width < WIDTHS.at(-1))
    notes.push(`only ${width}px wide, may look soft on large screens`);
  log(
    `${path.basename(file)} -> ${widths.join(", ")}` +
      (notes.length ? ` (${notes.join("; ")})` : ""),
  );
  return { width: top, height, widths, hash, ...(blur && { blur }) };
}

async function buildOgImage(heroFile) {
  const logo = await fsp.readFile(logoPath, "utf8");
  const mark = await sharp(
    Buffer.from(logo.replace(/fill="#[0-9a-f]+"/i, 'fill="#f0f0f0"')),
    { density: 1200 },
  )
    .resize(150, 150)
    .png()
    .toBuffer();
  const text = (x, y, size, content, extra = "") =>
    `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" ${extra}>${content}</text>`;
  const overlay = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#151515" stop-opacity=".95"/><stop offset=".55" stop-color="#151515" stop-opacity=".55"/><stop offset="1" stop-color="#151515" stop-opacity=".1"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    ${text(80, 330, 76, "Seu projeto ganha", 'font-weight="700" letter-spacing="-3" fill="#f0f0f0"')}
    ${text(80, 415, 76, "forma no aço.", 'font-weight="700" letter-spacing="-3" fill="#f0f0f0"')}
    ${text(80, 480, 28, "Corte a laser, oxicorte e dobra de chapas", 'fill="#c3c3c3"')}
    ${text(245, 200, 40, "JF OXICORTE", 'font-weight="700" fill="#f0f0f0"')}
  </svg>`,
  );
  await sharp(heroFile, { autoOrient: true })
    .flatten({ background: "#2e3134" }) // transparent placeholder -> solid
    .resize(1200, 630, { fit: "cover", position: "right" })
    .modulate({ brightness: 0.7 })
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: mark, left: 80, top: 85 },
    ])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(ogPath);
  log("hero -> og-image.jpg");
}

export async function generate() {
  const { originals, errors } = listOriginals();
  if (!originals.has("hero"))
    errors.push("hero.* is missing (hero background and Open Graph image).");
  if (errors.length) throw new Error(errors.join("\n"));

  await fsp.mkdir(outDir, { recursive: true });
  const previous = await readManifest();
  const photos = {};
  let built = 0;

  for (const [name, file] of originals) {
    const hash = crypto
      .createHash("sha256")
      .update(`${VERSION}:${QUALITY}:${WIDTHS}:`)
      .update(await fsp.readFile(file))
      .digest("hex")
      .slice(0, 8);
    const cached = previous.photos?.[name];
    const upToDate =
      cached?.hash === hash &&
      cached.widths.every((w) =>
        fs.existsSync(path.join(outDir, `${name}.${hash}-${w}.webp`)),
      );
    photos[name] = upToDate ? cached : await buildPhoto(name, file, hash);
    if (!upToDate) built++;
  }

  const og = photos.hero.hash;
  if (previous.og !== og || !fs.existsSync(ogPath)) {
    await buildOgImage(originals.get("hero"));
    built++;
  }

  // Remove variants of deleted or replaced photos.
  const keep = new Set(
    Object.entries(photos).flatMap(([name, p]) =>
      p.widths.map((w) => `${name}.${p.hash}-${w}.webp`),
    ),
  );
  const stale = (await fsp.readdir(outDir)).filter((file) => !keep.has(file));
  for (const file of stale) await fsp.rm(path.join(outDir, file));
  if (stale.length) log(`removed ${stale.length} outdated files`);
  built += stale.length;

  const manifest = JSON.stringify({ og, photos }, null, 2) + "\n";
  if (JSON.stringify(previous, null, 2) + "\n" !== manifest) {
    await fsp.writeFile(manifestPath, manifest);
  }
  if (!built) log(`${originals.size} photos up to date`);
}

export function watch() {
  let timer;
  let running = Promise.resolve();
  const run = () =>
    (running = running.then(() =>
      generate().catch((error) => console.error(`[images] ${error.message}`)),
    ));
  fs.watch(photosDir, () => {
    // Debounce: copying a large file fires several events.
    clearTimeout(timer);
    timer = setTimeout(run, 400);
  });
  log(`watching ${path.relative(root, photosDir)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await generate();
  } catch (error) {
    console.error(`[images] ${error.message}`);
    process.exit(1);
  }
  if (process.argv.includes("--watch")) watch();
}
