/** Public GA4 ID, baked into the static export. Empty disables analytics. */
export const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim() ?? "";

if (gaMeasurementId && !/^G-[A-Z0-9]+$/.test(gaMeasurementId)) {
  throw new Error(
    "GA_MEASUREMENT_ID must be a GA4 measurement ID (G-XXXXXXXXXX).",
  );
}
