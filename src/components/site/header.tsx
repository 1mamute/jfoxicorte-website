import { navigation } from "@/content/home";

import { BrandLockup } from "./brand-lockup";
import { ContactLink } from "./contact-link";
import { Icon } from "./icons";
import { MobileMenu } from "./mobile-menu";

const iconLink =
  "grid size-[38px] shrink-0 place-items-center transition-transform duration-200 hover:-translate-y-0.5 xs:size-[42px] md:size-10 lg:size-11";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink bg-[linear-gradient(110deg,#ffffff03,transparent_60%)]">
      <div className="container-site flex h-[calc(var(--header-h)-1px)] items-center gap-2 xs:gap-3 md:gap-4 lg:gap-[30px]">
        <a
          href="#inicio"
          className="w-24 shrink-0 text-foreground min-[361px]:w-[106px] xs:w-[119px] md:w-[145px]"
          aria-label="JF Oxicorte — início"
        >
          <BrandLockup />
        </a>

        <nav
          aria-label="Navegação principal"
          className="ml-auto hidden md:block"
        >
          <ul className="flex gap-[18px] text-sm font-bold lg:mr-3.5 lg:gap-[30px]">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative block py-[15px] after:absolute after:inset-x-0 after:bottom-[9px] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-[5px] min-[361px]:gap-[7px] xs:gap-[9px] md:ml-0 md:gap-2 lg:gap-2.5">
          <ContactLink
            channel="instagram"
            className={iconLink}
            aria-label="Instagram da JF Oxicorte"
            title="Instagram da JF Oxicorte"
          >
            <Icon name="instagram" className="size-[25px] xs:size-[26px]" />
          </ContactLink>
          <ContactLink
            channel="email"
            className={iconLink}
            aria-label="Enviar e-mail para a JF Oxicorte"
            title="Enviar e-mail para a JF Oxicorte"
          >
            <Icon name="mail" className="size-[29px] xs:size-[30px]" />
          </ContactLink>
          <ContactLink
            channel="whatsapp"
            className={iconLink}
            aria-label="Solicitar orçamento pelo WhatsApp"
            title="Solicitar orçamento pelo WhatsApp"
          >
            <Icon name="whatsapp" className="size-[25px] xs:size-[26px]" />
          </ContactLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
