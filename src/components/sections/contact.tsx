import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";
import { ServiceInfo } from "@/components/site/service-info";
import { buttonVariants } from "@/components/ui/button";
import { contacts, EMAIL_PLACEHOLDER } from "@/config/site";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="slide bg-night"
    >
      <div className="container-site">
        <p className="mb-[18px] eyebrow text-[#bcbcbc] md:mb-6">
          Pronto para dar forma à sua ideia?
        </p>
        <div className="grid items-center gap-7 sm:grid-cols-2 sm:gap-9 lg:gap-[60px]">
          <h2
            id="contato-titulo"
            className="text-[3.1rem] xs:text-[3.5rem] md:text-[clamp(2.8rem,5.5vw,4.8rem)]"
          >
            Vamos falar
            <br />
            do seu projeto.
          </h2>

          <div className="w-full max-w-[370px] min-w-0 sm:justify-self-end">
            <p className="mb-[25px]">
              Envie as medidas, o desenho ou a sua ideia.
              <br />O próximo passo começa com uma conversa.
            </p>
            <ContactLink
              channel="whatsapp"
              className={cn(
                buttonVariants(),
                "w-full justify-start px-[18px] whitespace-nowrap xs:px-[23px]",
              )}
            >
              <Icon name="whatsapp" />
              Solicitar orçamento no WhatsApp
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
        </div>
        <ServiceInfo className="mt-10 md:mt-14" />
      </div>
    </section>
  );
}
