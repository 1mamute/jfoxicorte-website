"use client";

import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const subscribe = () => () => {};
const serverSnapshot = () => false;
const analyticsAllowed = () =>
  !(navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl;

/** One page view plus native GA4 engagement; delegated clicks keep links static. */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const initialized = useRef(false);
  const enabled = useSyncExternalStore(
    subscribe,
    analyticsAllowed,
    serverSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.dataLayer ??= [];
    analyticsWindow.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params -- gtag.js requires Arguments command objects.
      analyticsWindow.dataLayer!.push(arguments);
    };

    // React Strict Mode may run the effect twice; configure only once.
    if (!initialized.current) {
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", measurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        // URLs may contain visitor data; keep only this page's path and the
        // referring origin, while retaining referral-source reporting.
        page_location: `${window.location.origin}${window.location.pathname}`,
        page_referrer: document.referrer
          ? new URL(document.referrer).origin
          : "",
      });
      initialized.current = true;
    }

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>("a, button, summary");
      if (!button || button.matches(":disabled, [aria-disabled='true']"))
        return;

      const context = button.closest<HTMLElement>(
        "[data-analytics-location], section[id], header, footer, [role='dialog']",
      );
      const name =
        button.dataset.analyticsName ||
        button.getAttribute("aria-label") ||
        button.textContent ||
        button.tagName.toLowerCase();

      // Only UI labels/context: no contact URLs, WhatsApp messages or form data.
      analyticsWindow.gtag?.("event", "button_click", {
        button_name: name.replace(/\s+/g, " ").trim().slice(0, 100),
        button_location:
          context?.dataset.analyticsLocation ||
          context?.id ||
          context?.getAttribute("role") ||
          context?.tagName.toLowerCase() ||
          "page",
        ...(button.dataset.analyticsChannel && {
          contact_channel: button.dataset.analyticsChannel,
        }),
        ...(button.dataset.analyticsService && {
          service_name: button.dataset.analyticsService,
        }),
      });
    };

    // Capture also sees clicks whose React handlers stop propagation or unmount.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled, measurementId]);

  return enabled ? (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  ) : null;
}
