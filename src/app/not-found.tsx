import type { Metadata } from "next";
import Link from "next/link";

import { BrandLockup } from "@/components/site/brand-lockup";
import { buttonVariants } from "@/components/ui/button";

// Exported as 404.html: configure it as the error document on S3/CloudFront.
export const metadata: Metadata = {
  title: "Página não encontrada | JF Oxicorte",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main
      id="principal"
      tabIndex={-1}
      className="grid min-h-svh place-items-center bg-page brushed px-[18px] py-16 text-center outline-none"
    >
      <div className="flex max-w-md flex-col items-center">
        <Link
          href="/"
          aria-label="JF Oxicorte — página inicial"
          className="mb-10"
        >
          <BrandLockup className="w-[180px]" />
        </Link>
        <p className="mb-[18px] eyebrow md:mb-6">Erro 404</p>
        <h1 className="mb-5 text-[2.5rem]">Página não encontrada.</h1>
        <p className="mb-8 text-soft">
          O endereço pode ter mudado ou não existe mais. Volte para a página
          inicial para conhecer nossos serviços.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
