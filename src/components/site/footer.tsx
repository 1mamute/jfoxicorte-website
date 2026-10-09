import { site } from "@/config/site";
import { cn } from "@/lib/utils";

import { BrandLockup } from "./brand-lockup";
import { ContactLink } from "./contact-link";
import { CurrentYear } from "./current-year";
import { Icon, type IconName } from "./icons";

const divider = "border-white/10 xs:border-l xs:pl-6 md:pl-7";

function InfoItem({
  icon,
  title,
  className,
  children,
}: {
  icon: IconName;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 items-start gap-[15px]", className)}>
      <Icon name={icon} className="size-[26px] text-[#bec3c7] md:size-7" />
      <div className="min-w-0">
        <h2 className="mb-1.5 text-sm leading-normal font-semibold tracking-normal text-[#eceeef]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

const infoText = "text-sm leading-[1.6] whitespace-pre-line text-[#aeb3b8]";

export function Footer() {
  return (
    // Snap point for the page end: with mandatory snapping the footer would
    // otherwise be unreachable below the last section.
    <footer className="snap-end bg-ink brushed">
      <div className="container-site grid gap-[25px] border-b border-white/10 py-[30px] xs:grid-cols-2 xs:gap-x-6 xs:gap-y-7 xs:py-8 md:grid-cols-3 md:gap-7 md:py-[38px]">
        <InfoItem icon="pin" title="Região de atendimento">
          <p className={infoText}>
            {site.serviceRegion ||
              "Consulte a disponibilidade para sua cidade."}
          </p>
        </InfoItem>
        <InfoItem
          icon="clock"
          title="Horário de atendimento"
          className={divider}
        >
          <p className={infoText}>
            {site.businessHours ||
              "Fale com a equipe para consultar os horários."}
          </p>
        </InfoItem>
        <InfoItem
          icon="whatsapp"
          title="Fale com a JF"
          className={cn(
            divider,
            "xs:col-span-2 xs:border-l-0 xs:pl-0 md:col-span-1 md:border-l md:pl-7",
          )}
        >
          <p className={infoText}>Envie seu desenho e peça um orçamento.</p>
          <ContactLink
            channel="whatsapp"
            className="mt-2.5 inline-block text-sm leading-normal text-[#dde1e4] underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-[#dde1e4]"
          >
            Conversar no WhatsApp
          </ContactLink>
        </InfoItem>
      </div>

      <div className="container-site grid grid-cols-[clamp(80px,23vw,110px)_minmax(0,1fr)_auto] items-center gap-2 py-[22px] min-[601px]:gap-5 min-[601px]:py-6 xs:grid-cols-[120px_minmax(0,1fr)_auto] xs:gap-3">
        <a
          href="#inicio"
          className="text-foreground"
          aria-label="JF Oxicorte — voltar ao início"
        >
          <BrandLockup className="gap-[5px]" />
        </a>
        <p className="text-center text-xs leading-normal text-muted-foreground">
          © <CurrentYear /> JF Oxicorte. Todos os direitos reservados.
        </p>
        <a
          href="#inicio"
          className="inline-flex items-center gap-1.5 justify-self-end text-xs leading-normal whitespace-nowrap text-muted-foreground hover:text-foreground"
        >
          Voltar ao início <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
