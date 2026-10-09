"use client";

import { useEffect, useRef, useState } from "react";

import { navigation } from "@/content/home";
import { cn } from "@/lib/utils";

const links = [...navigation, { href: "#contato", label: "Fale com a JF" }];

/** Disclosure menu for viewports below the desktop breakpoint (801px). */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 801px)");
    const close = () => desktop.matches && setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panel.current?.contains(target) &&
        !trigger.current?.contains(target)
      )
        setOpen(false);
    };
    desktop.addEventListener("change", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      desktop.removeEventListener("change", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="grid h-11 w-[31px] place-content-center gap-[6px] min-[361px]:w-9 xs:w-11 md:hidden"
        aria-expanded={open}
        aria-controls="menu-movel"
        aria-label="Menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className={cn(
            "block h-[1.5px] w-[21px] bg-foreground transition-transform duration-200 xs:w-[22px]",
            open && "translate-y-[3.75px] rotate-45",
          )}
        />
        <span
          className={cn(
            "block h-[1.5px] w-[21px] bg-foreground transition-transform duration-200 xs:w-[22px]",
            open && "-translate-y-[3.75px] -rotate-45",
          )}
        />
      </button>

      <div
        ref={panel}
        id="menu-movel"
        className={cn(
          "absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(.22,1,.36,1)] md:hidden",
          open
            ? "visible grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0",
        )}
      >
        <nav aria-label="Navegação móvel" className="min-h-0 overflow-hidden">
          <ul className="max-h-[calc(100svh-var(--header-h))] overflow-y-auto border-t border-white/8 bg-ink px-[18px] pt-3 pb-5 shadow-[0_12px_24px_#00000014] xs:px-5">
            {links.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-3 font-bold"
                  onClick={() => {
                    setOpen(false);
                    trigger.current?.focus({ preventScroll: true });
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
