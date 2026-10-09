"use client";

import { useEffect, useRef, type ComponentProps } from "react";

// Horizontal snap row that can also be dragged with a mouse.
// Touch keeps using the browser's native swipe.
export function ScrollRow(props: ComponentProps<"ul">) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maxLeft = () => el.scrollWidth - el.clientWidth;
    // Where each card rests. The last cards can't reach their own start, so
    // they rest at the end of the row (maxLeft).
    const stops = () => {
      const cards = [...el.children] as HTMLElement[];
      const first = cards[0]?.offsetLeft ?? 0;
      return cards.map((c) => Math.min(c.offsetLeft - first, maxLeft()));
    };
    const nearestStop = (left: number) => {
      const all = stops();
      let best = 0;
      all.forEach((s, i) => {
        if (Math.abs(s - left) < Math.abs(all[best] - left)) best = i;
      });
      return best;
    };

    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    // Recent pointer positions, to tell a flick from a slow drag.
    let samples: { x: number; t: number }[] = [];
    let snapTimer = 0;

    // Hands control back to CSS scroll snap once the settle animation ends.
    // Re-enabling it mid-animation makes the row jump.
    const restoreSnap = () => {
      window.clearTimeout(snapTimer);
      el.removeEventListener("scrollend", restoreSnap);
      if (!dragging) el.style.scrollSnapType = "";
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      // From 700px up the cards are a static grid: leave the mouse alone.
      if (maxLeft() <= 1) return;
      // A previous settle may still be running; its restore must not turn
      // snap back on in the middle of this drag.
      window.clearTimeout(snapTimer);
      el.removeEventListener("scrollend", restoreSnap);
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      samples = [{ x: e.clientX, t: e.timeStamp }];
      el.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.cursor = "grabbing";
      }
      samples.push({ x: e.clientX, t: e.timeStamp });
      samples = samples.filter((s) => e.timeStamp - s.t < 100);
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "";
      if (!moved) {
        el.style.scrollSnapType = "";
        return;
      }
      // The click that follows this pointerup (if any) fires before timers.
      window.setTimeout(() => (moved = false));
      // Settle on the card the drag points at: a flick or a drag past 40px
      // always moves at least one card in its direction.
      const all = stops();
      const from = nearestStop(startLeft);
      const first = samples[0];
      const elapsed = e.timeStamp - first.t;
      const velocity = elapsed > 0 ? (e.clientX - first.x) / elapsed : 0;
      let to = nearestStop(el.scrollLeft - velocity * 120);
      const dragged = startLeft - el.scrollLeft;
      if (to === from && (Math.abs(dragged) > 40 || Math.abs(velocity) > 0.3)) {
        const direction = -Math.sign(dragged || velocity);
        to = Math.max(0, Math.min(all.length - 1, from + direction));
      }
      if (Math.abs(all[to] - el.scrollLeft) < 1) {
        restoreSnap();
        return;
      }
      el.addEventListener("scrollend", restoreSnap);
      // Fallback for browsers without `scrollend`.
      snapTimer = window.setTimeout(restoreSnap, 700);
      el.scrollTo({
        left: all[to],
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };
    // A drag must not end up activating a link under the cursor.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // Stops the browser's native image/link drag from hijacking the gesture.
    const onDragStart = (e: DragEvent) => e.preventDefault();
    // Stops text selection, which would otherwise auto-scroll the row while
    // the mouse moves.
    const onSelectStart = (e: Event) => {
      if (dragging) e.preventDefault();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("selectstart", onSelectStart);
    el.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.clearTimeout(snapTimer);
      el.removeEventListener("scrollend", restoreSnap);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("selectstart", onSelectStart);
      el.removeEventListener("click", onClick, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <ul ref={ref} {...props} />;
}
