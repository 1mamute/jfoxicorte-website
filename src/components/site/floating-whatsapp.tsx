"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fixed bottom-right holder for the WhatsApp shortcut. It stays out of the
 * way over the hero (which has its own WhatsApp button) and rises as the
 * footer scrolls into view so it never covers the footer links. Without JS
 * it is simply always shown.
 */
export function FloatingDock({ children }: { children: ReactNode }) {
  const dock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const hero = document.getElementById("inicio");
    const element = dock.current;
    if (!footer || !element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const overlap = window.innerHeight - footer.getBoundingClientRect().top;
      element.style.setProperty(
        "--dock-lift",
        `${Math.max(0, overlap + 16)}px`,
      );
      const overHero =
        !!hero &&
        hero.getBoundingClientRect().bottom >
          element.getBoundingClientRect().top;
      element.toggleAttribute("data-shown", !overHero);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={dock}
      className="dock-reveal fixed right-5 bottom-[max(20px,var(--dock-lift,0px))] z-30 md:right-7 md:bottom-[max(28px,var(--dock-lift,0px))] print:hidden"
    >
      {children}
    </div>
  );
}
