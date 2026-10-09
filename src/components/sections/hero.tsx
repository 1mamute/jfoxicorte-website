import { preload } from "react-dom";

import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { photo } from "@/lib/images";

const heroImage = photo("laser");
const heroSizes = "100vw";

export function Hero() {
  // The hero photo is the LCP element: start downloading it with the HTML.
  preload(heroImage.src, {
    as: "image",
    imageSrcSet: heroImage.srcSet,
    imageSizes: heroSizes,
    fetchPriority: "high",
  });

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="relative isolate flex min-h-(--slide-h) snap-start overflow-hidden bg-[#151515] text-white"
    >
      {/* Shows until the (opaque) photo paints over it. */}
      <Skeleton
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-none"
      />
      <img
        src={heroImage.src}
        srcSet={heroImage.srcSet}
        sizes={heroSizes}
        width={heroImage.width}
        height={heroImage.height}
        alt="Processo de corte a laser de chapa metálica — foto ilustrativa"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover object-[65%_50%] brightness-50 md:object-[80%_50%] md:brightness-[.67]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#151515e8,#15151570),linear-gradient(0deg,#151515,transparent_70%)] md:bg-[linear-gradient(90deg,#151515_0%,#151515e6_26%,#15151566_62%,#15151510),linear-gradient(0deg,#151515a6,transparent_40%)]"
      />

      <div className="container-site flex flex-col items-start justify-center py-(--section-py)">
        <h1
          id="inicio-titulo"
          className="text-[clamp(3rem,min(14.5vw,11vh),3.75rem)] leading-[.98] xs:text-[clamp(3.1rem,min(10vw,11vh),5.2rem)] md:text-[clamp(3.15rem,min(6.5vw,10.4svh),6.1rem)]"
        >
          Seu projeto
          <br />
          ganha forma
          <br />
          <span className="text-transparent [-webkit-text-stroke:1px_#f0f0f0]">
            no aço.
          </span>
        </h1>
        <p className="mt-6 mb-[26px] leading-[1.65] text-[#c3c3c3] md:mt-[25px]">
          Corte a laser, oxicorte e dobra de chapas.
          <br />A solução sob medida para a sua próxima peça.
        </p>
        <div className="flex flex-col items-start gap-[21px] xs:flex-row xs:flex-wrap xs:items-center xs:gap-5 lg:gap-[30px]">
          <ContactLink channel="whatsapp" className={buttonVariants()}>
            <Icon name="whatsapp" />
            Vamos falar do seu projeto
          </ContactLink>
          <a
            href="#servicos"
            className="flex items-center gap-4 text-[0.8125rem] xs:text-sm"
          >
            Conheça nossos serviços
            <span aria-hidden="true" className="text-[23px]">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

const specialties = [
  { icon: "cut", label: "Corte sob medida" },
  { icon: "layers", label: "A36 · 1020 · Inox 304" },
  { icon: "ruler", label: "Do desenho à peça" },
] as const;

export function Specialties() {
  return (
    <div className="border-t border-white/10 bg-strip text-[#c4c4c4]">
      <ul className="container-site grid grid-cols-3 gap-[7px] py-[22px] xs:gap-5 md:gap-0 md:py-[27px]">
        {specialties.map((item) => (
          <li
            key={item.label}
            className="flex flex-col items-center justify-center gap-[9px] border-white/15 pr-1.5 text-center text-[0.6875rem] not-last:border-r xs:pr-0 xs:text-[0.75rem] md:flex-row md:gap-4 md:text-[0.875rem] md:first:justify-start md:last:justify-end"
          >
            <Icon
              name={item.icon}
              className="size-[22px] text-[#a9a9a9] md:size-[26px]"
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
