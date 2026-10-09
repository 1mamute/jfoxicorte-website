"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fixed bottom-right holder for the WhatsApp shortcut. It rises as the footer
 * scrolls into view so it never covers the footer links.
 */
export function FloatingDock({ children }: { children: ReactNode }) {
  const dock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
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
      className="fixed right-5 bottom-[max(20px,var(--dock-lift,0px))] z-30 md:right-7 md:bottom-[max(28px,var(--dock-lift,0px))] print:hidden"
    >
      {children}
    </div>
  );
}
