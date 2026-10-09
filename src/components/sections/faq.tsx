import { ChevronDown } from "lucide-react";

import { faq } from "@/content/home";

export function Faq() {
  return (
    <section
      id="duvidas"
      aria-labelledby="duvidas-titulo"
      // The content is centered, so opening an answer moves the text above it
      // up; scroll anchoring would follow it and pull the previous section
      // into view.
      className="edge-light slide bg-page brushed [overflow-anchor:none]"
    >
      <div className="container-site grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-7 md:grid-cols-[1fr_1.3fr] md:items-start md:gap-[45px] lg:gap-20">
        <div>
          <p className="mb-[18px] eyebrow md:mb-6">Antes de começar</p>
          <h2
            id="duvidas-titulo"
            className="text-section sm:text-[2.2rem] md:text-section"
          >
            Vamos tirar
            <br />
            suas dúvidas.
          </h2>
          <p className="mt-[22px]">
            Seu projeto tem uma necessidade específica?
            <br />
            Fale diretamente com a nossa equipe.
          </p>
        </div>

        {/* Native <details>: works without JS and keeps the answers in the HTML. */}
        <div>
          {faq.map((item) => (
            <details
              key={item.question}
              className="group faq-item border-b border-white/12 first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[19px] text-foreground transition-colors duration-200 hover:text-soft sm:py-5 md:py-[22px] [&::-webkit-details-marker]:hidden">
                <h3 className="text-base leading-normal font-semibold tracking-normal">
                  {item.question}
                </h3>
                <ChevronDown
                  aria-hidden="true"
                  className="size-[18px] shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="pr-2.5 pb-[22px] text-[0.9375rem] leading-[1.65] xs:pr-8">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
