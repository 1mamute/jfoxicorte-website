import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-12 px-6 py-20 sm:px-12">
      <section className="max-w-2xl space-y-6">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          JFOxicorte
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Nosso novo site está chegando.
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Estamos preparando um novo espaço para apresentar a JFOxicorte.
          Acompanhe as novidades em breve.
        </p>
        <Button asChild size="lg">
          <a href="#sobre">
            Saiba mais <ArrowDown aria-hidden="true" />
          </a>
        </Button>
      </section>
      <section id="sobre" className="scroll-mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold">JFOxicorte</h2>
        <p className="mt-3 text-muted-foreground">
          Em breve, mais informações sobre nossos serviços e formas de contato.
        </p>
      </section>
    </main>
  );
}
