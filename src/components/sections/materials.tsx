import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";
import { buttonVariants } from "@/components/ui/button";
import { materials } from "@/content/home";

export function Materials() {
  return (
    <section
      id="materiais"
      aria-labelledby="materiais-titulo"
      className="edge-light slide bg-graphite brushed"
    >
      <div className="container-site grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-7 md:items-stretch md:gap-[55px] lg:gap-[100px]">
        <div>
          <p className="mb-[18px] eyebrow text-[#bcbcbc] md:mb-6">
            Matéria-prima
          </p>
          <h2
            id="materiais-titulo"
            className="text-[2.4rem] sm:text-[2.5rem] md:text-[clamp(2.5rem,4.3vw,3.9rem)]"
          >
            A base de
            <br />
            um bom projeto.
          </h2>
          <p className="mt-[18px] mb-5 text-[#a9a9a9] sm:my-5 md:mt-[27px] md:mb-[29px]">
            Aço carbono e inox para diferentes aplicações.
            <br />
            Converse com a gente para definir o material
            <br className="hidden md:inline" /> e o processo do seu projeto.
          </p>
          <ContactLink
            channel="whatsapp"
            className={buttonVariants({ variant: "outline" })}
          >
            Consultar meu projeto
            <Icon name="whatsapp" />
          </ContactLink>
        </div>

        <ul aria-label="Materiais trabalhados">
          {materials.map((material, index) => (
            <li
              key={material.grade}
              className="flex items-center gap-[15px] border-t border-[#555] py-[13px] last:border-b sm:gap-3.5 sm:py-[18px] md:gap-6 md:py-6"
            >
              <span
                aria-hidden="true"
                className="self-start pt-1.5 text-xs text-[#939393] sm:pt-[3px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="grid min-w-0 flex-1 grid-cols-[68px_1fr] items-center gap-x-3 sm:block">
                <p className="col-start-2 row-start-1 mb-[3px] text-[0.625rem] tracking-[0.15em] text-[#a9a9a9] uppercase sm:mb-[7px] sm:text-xs">
                  {material.family}
                </p>
                <h3 className="col-start-1 row-span-2 row-start-1 m-0 text-2xl leading-[1.07] tracking-[-0.025em] sm:mb-[9px] sm:text-[1.65rem]">
                  {material.grade}
                </h3>
                <p className="col-start-2 row-start-2 text-[0.8125rem] leading-[1.4] text-[#b6b6b6] sm:text-sm sm:leading-[26px]">
                  {material.description}
                </p>
              </div>
              <Icon
                name="layers"
                className="ml-auto size-[23px] text-[#6f6f6f] sm:size-8"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
