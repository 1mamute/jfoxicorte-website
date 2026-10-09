import { ContactLink } from "@/components/site/contact-link";
import { Icon } from "@/components/site/icons";
import { galleries } from "@/content/home";
import { withPhotos } from "@/lib/images";

import { GalleryCarousel } from "./gallery-carousel";

export function Projects() {
  const [featured, ...others] = withPhotos(galleries);

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      className="edge-light slide bg-steel brushed"
    >
      <div className="container-site">
        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-[45px] md:items-center">
          <div>
            <p className="mb-[18px] eyebrow md:mb-6">Do material à forma</p>
            <h2 id="projetos-titulo" className="text-section">
              Possibilidades em aço.
            </h2>
          </div>
          <ContactLink
            channel="instagram"
            className="-my-[7px] inline-flex min-h-9 shrink-0 items-center gap-2.5 self-start text-sm font-semibold"
          >
            <Icon name="instagram" />
            Acompanhe no Instagram
            <span aria-hidden="true" className="link-line" />
          </ContactLink>
        </div>

        {/* Row height shrinks with the viewport so the whole section fits one screen. */}
        <div className="grid grid-cols-[1.15fr_1fr] grid-rows-[repeat(2,clamp(140px,calc((var(--slide-h)-2*var(--section-py)-160px)/2),230px))] gap-3.5 sm:grid-cols-[1.35fr_1fr] md:grid-rows-[repeat(2,clamp(140px,calc((var(--slide-h)-2*var(--section-py)-166px)/2),230px))] md:gap-5">
          <GalleryCarousel
            gallery={featured}
            className="row-span-2"
            sizes="(min-width: 1400px) 720px, (min-width: 700px) 56vw, 54vw"
          />
          {others.map((gallery) => (
            <GalleryCarousel
              key={gallery.id}
              gallery={gallery}
              sizes="(min-width: 1400px) 530px, (min-width: 700px) 42vw, 46vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
