import type { NextConfig } from "next";

// Set when the site is served from a sub-path (e.g. a GitHub Pages project
// site at /repo). Empty for a domain root.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath && { basePath }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
