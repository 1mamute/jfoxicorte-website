// Builds the site's photos from the originals in assets-src/photos/:
//
//   hero/1.jpg                    hero background (also the Open Graph image)
//   services/1.jpg, 2.jpg, ...    "O que fazemos" cards, in order
//   gallery/<id>/1.jpg + 1.json   "Do material à forma" galleries; <id> matches
//                                 a gallery in src/content/home.ts and each
//                                 JSON is { "text": "Visão geral" }
//
//   node scripts/images.mjs           one-off (also runs before dev/build/typecheck)
//   node scripts/images.mjs --watch   rebuild whenever a photo or JSON changes
//
// Writes content-hashed WebP variants to public/images/ and records sizes,
// variants, blurred previews and texts in src/lib/photos.generated.json (read
// by src/lib/images.ts). Unchanged photos are skipped. All outputs are
// generated, so they are git-ignored.
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
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const HEIC = /\.hei[cf]$/i;
const NUMBER = /^[1-9]\d*$/;
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const IGNORED = /^(\..*|thumbs\.db|desktop\.ini)$/i;

const log = (msg) => console.log(`[images] ${msg}`);
const rel = (file) => path.relative(photosDir, file).replaceAll("\\", "/");

async function readManifest() {
  try {
    return JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  } catch {
    return {};
  }
}

function entries(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !IGNORED.test(entry.name));
}

/**
 * Numbered photos of one folder (1.jpg, 2.jpg, ...), sorted by number. With
 * `texts`, every photo needs a matching N.json with { "text": "..." }.
 */
function numbered(dir, errors, { texts = false } = {}) {
  const photos = new Map();
  const jsons = new Map();
  for (const entry of entries(dir)) {
    const file = path.join(dir, entry.name);
    const { name, ext } = path.parse(entry.name);
    if (entry.isDirectory()) errors.push(`${rel(file)}: unexpected folder.`);
    else if (!NUMBER.test(name))
      errors.push(`${rel(file)}: name it with a number (1, 2, 3...).`);
    else if (texts && ext.toLowerCase() === ".json") jsons.set(name, file);
    else if (HEIC.test(ext))
      errors.push(`${rel(file)}: HEIC is not supported, export it as JPEG.`);
    else if (!IMAGE.test(ext))
      errors.push(`${rel(file)}: use JPEG, PNG, WebP or AVIF.`);
    else if (photos.has(name))
      errors.push(`${rel(file)}: duplicate of ${rel(photos.get(name))}.`);
    else photos.set(name, file);
  }

  const list = [...photos]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([number, file]) => ({ number, file }));
  if (!texts) return list;

  for (const [number, json] of jsons) {
    if (!photos.has(number)) errors.push(`${rel(json)}: no matching photo.`);
  }
  for (const photo of list) {
    const json = jsons.get(photo.number);
    if (!json) {
      errors.push(
        `${rel(photo.file)}: missing ${photo.number}.json with { "text": "..." }.`,
      );
      continue;
    }
    try {
      const data = JSON.parse(fs.readFileSync(json, "utf8"));
      const extra = Object.keys(data ?? {}).find((key) => key !== "text");
      if (typeof data?.text !== "string" || !data.text.trim())
        throw new Error('expected { "text": "..." }');
      if (extra) throw new Error(`unexpected key "${extra}"`);
      photo.text = data.text.trim();
    } catch (error) {
      errors.push(`${rel(json)}: ${error.message}.`);
    }
  }
  return list;
}

/** Reads the folder layout described at the top of this file. */
function scan() {
  const errors = [];
  const at = (...p) => path.join(photosDir, ...p);
  const isDir = (dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory();

  for (const entry of entries(photosDir)) {
    const known = ["hero", "services", "gallery"].includes(entry.name);
    if (!known || !entry.isDirectory())
      errors.push(
        `${entry.name}: only the hero/, services/ and gallery/ folders belong here.`,
      );
  }

  const hero = isDir(at("hero")) ? numbered(at("hero"), errors) : [];
  if (hero.length !== 1 || hero[0].number !== "1")
    errors.push("hero/: needs exactly one photo, named 1 (e.g. hero/1.jpg).");

  const services = isDir(at("services"))
    ? numbered(at("services"), errors)
    : [];
  if (!services.length)
    errors.push("services/: add the service photos (1.jpg, 2.jpg, ...).");

  const galleries = {};
  if (isDir(at("gallery"))) {
    for (const entry of entries(at("gallery"))) {
      const dir = at("gallery", entry.name);
      if (!entry.isDirectory() || !SLUG.test(entry.name)) {
        errors.push(
          `${rel(dir)}: expected a gallery folder (lowercase letters, digits, hyphens).`,
        );
        continue;
      }
      galleries[entry.name] = numbered(dir, errors, { texts: true });
      if (!galleries[entry.name].length) errors.push(`${rel(dir)}: no photos.`);
    }
  }
  if (!Object.keys(galleries).length)
    errors.push("gallery/: add at least one gallery folder.");

  if (errors.length) throw new Error(errors.join("\n"));
  return { hero: hero[0], services, galleries };
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
    `${rel(file)} -> ${widths.join(", ")}` +
      (notes.length ? ` (${notes.join("; ")})` : ""),
  );
  return { name, width: top, height, widths, hash, ...(blur && { blur }) };
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
  const layout = scan();
  await fsp.mkdir(outDir, { recursive: true });

  const previous = await readManifest();
  const cache = new Map(
    [
      previous.hero,
      ...(previous.services ?? []),
      ...Object.values(previous.galleries ?? {}).flat(),
    ]
      .filter(Boolean)
      .map((entry) => [entry.name, entry]),
  );
  let built = 0;

  const build = async (name, { file, text }) => {
    const hash = crypto
      .createHash("sha256")
      .update(`${VERSION}:${QUALITY}:${WIDTHS}:`)
      .update(await fsp.readFile(file))
      .digest("hex")
      .slice(0, 8);
    const cached = cache.get(name);
    const upToDate =
      cached?.hash === hash &&
      cached.widths.every((w) =>
        fs.existsSync(path.join(outDir, `${name}.${hash}-${w}.webp`)),
      );
    if (!upToDate) built++;
    const entry = {
      ...(upToDate ? cached : await buildPhoto(name, file, hash)),
    };
    delete entry.text;
    return text === undefined ? entry : { ...entry, text };
  };

  const hero = await build("hero-1", layout.hero);
  const services = [];
  for (const photo of layout.services)
    services.push(await build(`services-${photo.number}`, photo));
  const galleries = {};
  for (const [id, photos] of Object.entries(layout.galleries)) {
    galleries[id] = [];
    for (const photo of photos)
      galleries[id].push(await build(`gallery-${id}-${photo.number}`, photo));
  }

  const og = hero.hash;
  if (previous.og !== og || !fs.existsSync(ogPath)) {
    await buildOgImage(layout.hero.file);
    built++;
  }

  // Remove variants of deleted or replaced photos.
  const keep = new Set(
    [hero, ...services, ...Object.values(galleries).flat()].flatMap((p) =>
      p.widths.map((w) => `${p.name}.${p.hash}-${w}.webp`),
    ),
  );
  const stale = (await fsp.readdir(outDir)).filter((file) => !keep.has(file));
  for (const file of stale) await fsp.rm(path.join(outDir, file));
  if (stale.length) log(`removed ${stale.length} outdated files`);
  built += stale.length;

  const manifest =
    JSON.stringify({ og, hero, services, galleries }, null, 2) + "\n";
  if (JSON.stringify(previous, null, 2) + "\n" !== manifest) {
    await fsp.writeFile(manifestPath, manifest);
    if (!built) log("texts updated");
  } else if (!built) {
    log("photos up to date");
  }
}

export function watch() {
  let timer;
  let running = Promise.resolve();
  const run = () =>
    (running = running.then(() =>
      generate().catch((error) => console.error(`[images] ${error.message}`)),
    ));
  fs.watch(photosDir, { recursive: true }, () => {
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
