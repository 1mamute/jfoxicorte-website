import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Materials } from "@/components/sections/materials";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { ContactLink } from "@/components/site/contact-link";
import { FloatingDock } from "@/components/site/floating-whatsapp";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Icon } from "@/components/site/icons";

export default function Home() {
  return (
    <>
      <Header />
      <main id="principal" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Services />
        <Materials />
        <Projects />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingDock>
        <ContactLink
          channel="whatsapp"
          aria-label="Conversar com a JF Oxicorte no WhatsApp"
          className="peer grid size-14 place-items-center transition-transform duration-200 hover:-translate-y-[3px] md:size-[61px]"
        >
          <Icon
            name="whatsapp"
            className="size-12 drop-shadow-[0_2px_3px_#00000040]"
          />
        </ContactLink>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[calc(100%+6px)] translate-x-[5px] -translate-y-1/2 rounded-[3px] bg-[#343638] px-[13px] py-[7px] text-xs whitespace-nowrap opacity-0 transition-[opacity,translate] duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 peer-focus-visible:translate-x-0 peer-focus-visible:opacity-100"
        >
          Fale com a JF
        </span>
      </FloatingDock>
    </>
  );
}
