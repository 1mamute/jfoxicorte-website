/**
 * Visual switches for finishes still being evaluated. Read at build time, so
 * rebuild after editing.
 */
export const appearance = {
  /**
   * Brushed-steel section backgrounds: light from the upper left, darker
   * lower edge and fine horizontal grain. Off falls back to the subtle sheen.
   */
  brushedSteel: true,
  /**
   * Machined-part cards (services, project photos): lit top edge, shaded
   * bottom edge and a soft drop shadow. Off leaves them flat.
   */
  bevel: true,
} as const;

/** Space-separated `data-finish` value set on <html>; the CSS matches each word. */
export const finish = [
  appearance.brushedSteel && "brushed",
  appearance.bevel && "bevel",
]
  .filter(Boolean)
  .join(" ");
