// Responsive variants are produced by `npm run images` (scripts/generate-images.mjs)
// into public/images/<name>-<width>.webp. Keep the widths below in sync.
const PHOTO_WIDTHS = [480, 800, 1200, 1600];

const photos = {
  laser: { width: 1600, height: 1067 },
  torch: { width: 1200, height: 801 },
  bending: { width: 1200, height: 800 },
} as const;

export type PhotoName = keyof typeof photos;

export function photo(name: PhotoName) {
  const { width, height } = photos[name];
  const widths = [
    ...new Set([...PHOTO_WIDTHS.filter((w) => w < width), width]),
  ];
  return {
    src: `/images/${name}-${widths.at(-1)}.webp`,
    srcSet: widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", "),
    width,
    height,
  };
}
