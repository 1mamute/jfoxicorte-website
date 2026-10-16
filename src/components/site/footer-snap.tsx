"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FooterSnap({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = footer.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        (event.target instanceof Element &&
          event.target.closest('[role="dialog"]'))
      ) {
        return;
      }

      // A short upward wheel step must leave the footer's snap point;
      // otherwise the browser can pull the page back to the very bottom.
      element.style.scrollSnapAlign = event.deltaY < 0 ? "none" : "end";
    };
    const onScrollEnd = () => {
      element.style.removeProperty("scroll-snap-align");
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("scrollend", onScrollEnd);
      element.style.removeProperty("scroll-snap-align");
    };
  }, []);

  return (
    <footer ref={footer} className="edge-light snap-end bg-ink brushed">
      {children}
    </footer>
  );
}
