import type { MetadataRoute } from "next";

import { basePath } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JF Oxicorte",
    short_name: "JF Oxicorte",
    description:
      "Corte a laser, oxicorte e dobra de chapas em aço carbono e inox.",
    lang: "pt-BR",
    start_url: `${basePath}/`,
    display: "browser",
    background_color: "#101112",
    theme_color: "#090a0b",
    icons: [
      { src: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
      {
        src: `${basePath}/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
