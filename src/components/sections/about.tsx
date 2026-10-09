import { BrandLockup } from "@/components/site/brand-lockup";
import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";

const optionLink =
  "mt-2.5 inline-flex min-h-9 min-w-0 items-center gap-2.5 text-sm font-semibold";

export function About() {
  return (
    <section
      id="empresa"
      aria-labelledby="empresa-titulo"
      className="slide bg-page brushed"
    >
      <div className="container-site grid items-center gap-[26px] sm:grid-cols-2 sm:gap-7 md:gap-[55px] lg:gap-[100px]">
        <div className="flex justify-center">
          <BrandLockup
            tagline
            className="w-[min(100%,290px)] gap-2 sm:w-[min(100%,340px)] sm:gap-3"
          />
        </div>

        <div className="@container min-w-0">
          <p className="mb-[18px] eyebrow md:mb-6">Quem somos</p>
          <h2
            id="empresa-titulo"
            className="mb-[18px] text-[2rem] md:mb-[25px] md:text-section"
          >
            A sua ideia.
            <br />O nosso próximo corte.
          </h2>
          <div className="space-y-3.5 leading-[1.55] sm:space-y-[15px] md:space-y-[18px]">
            <p>
              A JF Oxicorte trabalha com corte a maçarico, corte a laser e dobra
              de chapas em aço carbono e inox. Cada projeto começa com uma
              conversa para entender a peça, o material e a aplicação.
            </p>
            <p>
              Envie seu desenho ou as medidas do que você precisa. Vamos avaliar
              o processo e preparar o orçamento para o seu projeto.
            </p>
          </div>
          <div className="mt-[18px] grid grid-cols-2 items-center gap-4 sm:mt-6 @max-[550px]:grid-cols-1 @max-[550px]:gap-3">
            <ContactLink channel="email" className={optionLink}>
              <Icon name="mail" />
              Envie seu projeto por e-mail
            </ContactLink>
            <ContactLink
              channel="whatsapp"
              className={`${optionLink} justify-self-end @max-[550px]:justify-self-start`}
            >
              <Icon name="whatsapp" />
              Envie seu projeto por WhatsApp
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
