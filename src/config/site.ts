/**
 * Business data used across the page, metadata, JSON-LD, robots and sitemap.
 *
 * Leave a contact empty until the official value exists: the page then shows
 * an "em atualização" notice instead of linking to a fictitious number or
 * profile. Every value is read at build time, so rebuild after editing.
 *
 * `SITE_URL` (env, e.g. in `.env.production`) overrides `url` so staging and
 * production builds can use different domains.
 */
export const site = {
  name: "JF Oxicorte",
  /** Public HTTPS origin, without path. Enables canonical, og:url, og:image and sitemap. */
  url: process.env.SITE_URL ?? "https://jfoxicorte.com.br",
  /** 55 + area code + number (digits only). Ex.: "5511999999999". */
  whatsapp: "5519998534150",
  whatsappMessage: "Olá! Gostaria de solicitar um orçamento com a JF Oxicorte.",
  /** Ex.: "contato@jfoxicorte.com.br". */
  email: "vendas@jfoxicorte.com.br",
  /** Full profile URL. Ex.: "https://www.instagram.com/jfoxicorte/". */
  instagram: "https://www.instagram.com/jfoxicorte/",
  city: "Piracicaba",
  state: "SP",
  /** Real service area. Shown in the footer when filled. */
  serviceRegion:
    "Piracicaba e região.\nConsulte a disponibilidade para outras cidades.",
  /** Real opening hours; line breaks are preserved. */
  businessHours: "08:00 às 17:00",
} as const;

export const EMAIL_PLACEHOLDER = "contato@jfoxicorte.example";

export type ContactChannel = "whatsapp" | "email" | "instagram";

function httpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

/** Normalised site origin (`https://example.com`) or null when not configured. */
export const siteOrigin = (() => {
  const url = httpsUrl(site.url);
  if (site.url && !url)
    throw new Error(`SITE_URL must be an HTTPS URL, got "${site.url}".`);
  return url ? url.origin : null;
})();

/** Sub-path the site is served from (from `BASE_PATH`), or "" at the root. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Origin plus base path, without a trailing slash; null when not configured. */
export const siteBase = siteOrigin ? `${siteOrigin}${basePath}` : null;

const phone = site.whatsapp.replace(/\D/g, "");
const hasWhatsapp = /^55\d{10,11}$/.test(phone);
const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email);
const instagramUrl = httpsUrl(site.instagram)?.href ?? null;

// A filled but malformed contact fails the build instead of silently showing
// the "em atualização" notice.
if (site.whatsapp && !hasWhatsapp)
  throw new Error(
    `site.whatsapp must be 55 + area code + number, got "${site.whatsapp}".`,
  );
if (site.email && !hasEmail)
  throw new Error(`site.email is not a valid address: "${site.email}".`);
if (site.instagram && !instagramUrl)
  throw new Error(`site.instagram must be an HTTPS URL: "${site.instagram}".`);

export const contacts = {
  phone: hasWhatsapp ? `+${phone}` : null,
  email: hasEmail ? site.email : null,
  instagram: instagramUrl,
};

/**
 * Resolves the destination of a contact link, or null when the channel is not
 * configured yet (the link then opens the notice dialog).
 */
export function contactHref(channel: ContactChannel, service?: string) {
  switch (channel) {
    case "whatsapp": {
      if (!hasWhatsapp) return null;
      const text = service
        ? `Olá! Gostaria de um orçamento para ${service} com a JF Oxicorte.`
        : site.whatsappMessage;
      return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }
    case "email":
      return hasEmail
        ? `mailto:${site.email}?subject=${encodeURIComponent("Orçamento — JF Oxicorte")}`
        : null;
    case "instagram":
      return instagramUrl;
  }
}
