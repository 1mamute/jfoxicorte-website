import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";
import { ServiceInfo } from "@/components/site/service-info";
import { buttonVariants } from "@/components/ui/button";
import { contacts, EMAIL_PLACEHOLDER, mapsHref, site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="edge-light slide bg-night"
    >
      <div className="container-site">
        <p className="mb-[18px] eyebrow text-[#bcbcbc] md:mb-6">
          Pronto para dar forma à sua ideia?
        </p>
        <div className="grid items-center gap-7 sm:grid-cols-2 sm:gap-x-9 sm:gap-y-8 lg:gap-x-[60px]">
          <h2
            id="contato-titulo"
            className="min-w-0 text-[3.1rem] xs:text-[3.5rem] sm:self-end md:text-[clamp(2.8rem,5.5vw,4.8rem)]"
          >
            Vamos falar
            <br />
            do seu projeto.
          </h2>

          <div className="w-full max-w-[370px] min-w-0 sm:col-start-2 sm:row-start-1 sm:justify-self-end">
            <p className="mb-[25px]">
              Envie as medidas, o desenho ou a sua ideia.
              <br />O próximo passo começa com uma conversa.
            </p>
            <ContactLink
              channel="whatsapp"
              className={cn(
                buttonVariants(),
                "sheen w-full justify-start px-[18px] text-left whitespace-normal xs:px-[23px]",
              )}
            >
              <Icon name="whatsapp" />
              Solicitar orçamento no WhatsApp
            </ContactLink>
            <ContactLink
              channel="phone"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-3 w-full justify-start px-[18px] xs:px-[23px]",
              )}
            >
              <Icon name="phone" />
              {contacts.phoneDisplay
                ? `Ligar: ${contacts.phoneDisplay}`
                : "Ligar para a JF Oxicorte"}
            </ContactLink>
            <ContactLink
              channel="email"
              className="mt-[22px] flex items-center gap-3 px-[19px] text-[0.8125rem] leading-normal [overflow-wrap:anywhere] text-[#c4c4c4] xs:px-6 xs:text-sm"
            >
              <Icon name="mail" />
              {contacts.email ?? EMAIL_PLACEHOLDER}
            </ContactLink>
            <ContactLink
              channel="instagram"
              className="mt-[22px] flex min-h-9 w-fit items-center gap-3 px-[19px] text-sm text-[#dedede] xs:px-6 sm:mt-[26px]"
            >
              <Icon name="instagram" />
              Instagram
            </ContactLink>
          </div>
          <div className="flex max-w-[370px] min-w-0 items-start gap-3 border-t border-white/10 pt-6 sm:col-start-1 sm:row-start-2 sm:self-start">
            <Icon name="pin" className="text-[#bec3c7]" />
            <div className="min-w-0">
              <h3 className="mb-1.5 text-sm leading-normal font-semibold tracking-normal text-[#eceeef]">
                Onde estamos
              </h3>
              <address className="text-sm leading-[1.6] text-[#aeb3b8] not-italic">
                {site.streetAddress}
                <br />
                {site.neighborhood} · {site.city} – {site.state}
                <br />
                CEP {site.postalCode}
              </address>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-name="Ver endereço no Google Maps"
                className="mt-2 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#dedede] hover:text-foreground"
              >
                Ver no Google Maps
                <span aria-hidden="true" className="link-line" />
              </a>
            </div>
          </div>
          <ServiceInfo className="w-full max-w-[370px] border-t border-white/10 pt-6 sm:col-start-2 sm:row-start-2 sm:self-start sm:justify-self-end [&>div]:gap-3 [&>div]:px-[19px] xs:[&>div]:px-6" />
        </div>
      </div>
    </section>
  );
}
