/**
 * Visual switches for finishes still being evaluated. Read at build time, so
 * rebuild after editing.
 */
export const appearance = {
  /**
   * Brushed-steel section backgrounds: light from the upper left, darker
   * lower edge and fine horizontal grain. Off falls back to the faint default.
   */
  brushedSteel: true,
  /**
   * Machined-part cards (services, project photos): lit top edge, shaded
   * bottom edge and a soft drop shadow. Off leaves them flat.
   */
  bevel: true,
  /**
   * A reflection sweeping across the WhatsApp buttons in the hero and contact
   * sections on hover. Off leaves the hover without it.
   */
  sheen: true,
} as const;

/** Space-separated `data-finish` value set on <html>; the CSS matches each word. */
export const finish = [
  appearance.brushedSteel && "brushed",
  appearance.bevel && "bevel",
  appearance.sheen && "sheen",
]
  .filter(Boolean)
  .join(" ");
