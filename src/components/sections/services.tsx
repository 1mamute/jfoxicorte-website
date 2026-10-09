import { ContactLink } from "@/components/site/contact-link";
import { PhotoPlaceholder } from "@/components/site/photo-placeholder";
import { ScrollRow } from "@/components/site/scroll-row";
import { services } from "@/content/home";
import { servicePhotos } from "@/lib/images";

// Photos come from assets-src/photos/services/, matched to the services by order.
const photos = servicePhotos(services.length);

export function Services() {
  return (
    <section
      id="servicos"
      aria-labelledby="servicos-titulo"
      className="slide bg-steel brushed"
    >
      <div className="container-site">
        <h2
          id="servicos-titulo"
          className="mb-6 text-sm leading-normal font-semibold tracking-[0.17em] text-muted-foreground uppercase sm:mb-7"
        >
          O que fazemos
        </h2>

        {/* Below 700px the cards become a swipeable row (CSS scroll snap; ScrollRow adds mouse drag). */}
        <ScrollRow
          aria-label="Serviços da JF Oxicorte"
          className="flex cursor-grab snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto overscroll-x-contain motion-reduce:snap-none sm:grid sm:cursor-auto sm:grid-cols-3 sm:overflow-visible lg:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service, index) => {
            const image = photos[index];
            return (
              <li
                key={service.title}
                className="flex w-[min(88%,360px)] shrink-0 snap-start last:snap-end sm:w-auto sm:min-w-0"
              >
                <article className="group flex w-full flex-col overflow-hidden rounded-[4px] border border-white/10 bg-surface bg-[linear-gradient(135deg,#ffffff05,transparent_50%)]">
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface">
                    <PhotoPlaceholder image={image} />
                    <img
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(min-width: 1400px) 400px, (min-width: 700px) 32vw, 360px"
                      width={image.width}
                      height={image.height}
                      alt={service.alt}
                      loading="lazy"
                      decoding="async"
                      className="relative size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[18px] left-[18px] grid size-[34px] place-items-center border border-white/40 bg-[#15151550] text-xs text-white"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-[22px] sm:p-5 lg:p-6">
                    <p className="mb-2.5 text-xs tracking-[0.13em] uppercase sm:mb-3">
                      {service.category}
                    </p>
                    <h3 className="mb-3.5 text-2xl leading-[1.13] sm:min-h-[50px] sm:text-[1.35rem] lg:min-h-[54px] lg:text-2xl">
                      {service.title}
                    </h3>
                    <p className="leading-normal text-soft sm:leading-[1.45] lg:leading-normal">
                      {service.description}
                    </p>
                    <ul
                      aria-label="Materiais e aplicações"
                      className="mt-auto mb-5 flex flex-wrap items-start gap-1.5 pt-[18px] sm:mb-[18px] sm:min-h-[39px] sm:pt-4 lg:mb-[22px] lg:min-h-[43px] lg:pt-5"
                    >
                      {service.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-[3px] border border-white/15 px-2 py-1 text-xs leading-normal whitespace-nowrap text-soft"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <ContactLink
                      channel="whatsapp"
                      service={service.service}
                      className="inline-flex items-center gap-2.5 self-start text-sm font-semibold xs:whitespace-nowrap"
                    >
                      {service.cta}
                      <span aria-hidden="true" className="link-line" />
                    </ContactLink>
                  </div>
                </article>
              </li>
            );
          })}
        </ScrollRow>
      </div>
    </section>
  );
}
