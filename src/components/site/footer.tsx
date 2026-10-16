import { contacts, mapsHref, site } from "@/config/site";

import { BrandLockup } from "./brand-lockup";
import { ContactLink } from "./contact-link";
import { CurrentYear } from "./current-year";
import { Icon } from "./icons";

export function Footer() {
  return (
    // Snap point for the page end, so a scroll that stops near the bottom
    // settles with the footer fully in view.
    <footer className="edge-light snap-end bg-ink brushed">
      <div className="container-site flex flex-col gap-3 border-b border-white/10 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <address className="min-w-0 not-italic">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-name="Ver endereço no Google Maps"
            className="flex items-start gap-3 py-1 hover:text-foreground"
          >
            <Icon name="pin" className="size-5" />
            <span>
              {site.streetAddress} · {site.neighborhood}
              <br />
              {site.city} – {site.state} · CEP {site.postalCode}
            </span>
          </a>
        </address>
        <ContactLink
          channel="phone"
          className="inline-flex min-h-11 w-fit shrink-0 items-center gap-3 font-semibold whitespace-nowrap hover:text-foreground"
        >
          <Icon name="phone" className="size-5" />
          {contacts.phoneDisplay ?? "Ligar para a JF Oxicorte"}
        </ContactLink>
      </div>
      <div className="container-site grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-4 py-[22px] min-[601px]:gap-5 min-[601px]:py-6 xs:grid-cols-[120px_minmax(0,1fr)_auto] xs:gap-3">
        <a
          href="#inicio"
          className="w-[clamp(80px,23vw,110px)] text-foreground xs:w-auto"
          aria-label="JF Oxicorte — voltar ao início"
        >
          <BrandLockup className="gap-[5px]" />
        </a>
        <p className="order-last col-span-2 text-center text-xs leading-normal text-muted-foreground xs:order-none xs:col-span-1">
          © <CurrentYear /> JF Oxicorte. Todos os direitos reservados.
        </p>
        <a
          href="#inicio"
          className="inline-flex min-h-6 items-center gap-1.5 justify-self-end text-xs leading-normal whitespace-nowrap text-muted-foreground hover:text-foreground"
        >
          Voltar ao início <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
