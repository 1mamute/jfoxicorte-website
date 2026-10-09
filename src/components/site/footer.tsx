import { BrandLockup } from "./brand-lockup";
import { CurrentYear } from "./current-year";

export function Footer() {
  return (
    // Snap point for the page end, so a scroll that stops near the bottom
    // settles with the footer fully in view.
    <footer className="edge-light snap-end bg-ink brushed">
      <div className="container-site grid grid-cols-[clamp(80px,23vw,110px)_minmax(0,1fr)_auto] items-center gap-2 py-[22px] min-[601px]:gap-5 min-[601px]:py-6 xs:grid-cols-[120px_minmax(0,1fr)_auto] xs:gap-3">
        <a
          href="#inicio"
          className="text-foreground"
          aria-label="JF Oxicorte — voltar ao início"
        >
          <BrandLockup className="gap-[5px]" />
        </a>
        <p className="text-center text-xs leading-normal text-muted-foreground">
          © <CurrentYear /> JF Oxicorte. Todos os direitos reservados.
        </p>
        <a
          href="#inicio"
          className="inline-flex items-center gap-1.5 justify-self-end text-xs leading-normal whitespace-nowrap text-muted-foreground hover:text-foreground"
        >
          Voltar ao início <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
