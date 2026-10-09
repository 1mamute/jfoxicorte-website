import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Inline SVG sprite rendered once in the layout. Brand glyphs (WhatsApp,
 * Instagram) are based on Simple Icons (CC0). Icons reference the symbols via
 * <use>, keeping the repeated markup small.
 */
export function IconSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute size-0 overflow-hidden"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="i-ig-gradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd776" />
          <stop offset="35%" stopColor="#f77737" />
          <stop offset="65%" stopColor="#e1306c" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>
      </defs>
      <symbol id="i-whatsapp" viewBox="0 0 24 24">
        <path
          d="M12 1a11 11 0 0 0-9.2 17L1 23l5.2-1.7A11 11 0 1 0 12 1Z"
          fill="#49b14e"
        />
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z"
          fill="#fff"
        />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect x="1" y="3.5" width="22" height="17" rx="3" fill="#e4e4e4" />
        <path
          d="m3.5 6 8.5 6.5L20.5 6"
          fill="none"
          stroke="#252525"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </symbol>
      <symbol id="i-instagram" viewBox="0 0 24 24">
        <rect
          x="1"
          y="1"
          width="22"
          height="22"
          rx="6.2"
          fill="url(#i-ig-gradient)"
        />
        <rect
          x="5"
          y="5"
          width="14"
          height="14"
          rx="4.3"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="3.3"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
        />
        <circle cx="16.8" cy="7.3" r="1.1" fill="#fff" />
      </symbol>
      <symbol
        id="i-cut"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v5l4 5 4-5V2M12 12v4M2 20h8l2-3 2 3h8M5 13l2 2m12-2-2 2M12 2v5" />
      </symbol>
      <symbol
        id="i-layers"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 8 10-5 10 5-10 5L2 8Zm0 5 10 5 10-5M2 18l10 5 10-5" />
      </symbol>
      <symbol
        id="i-ruler"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16v16H4zM8 4v5m4-5v3m4-3v5" />
      </symbol>
      <symbol
        id="i-pin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </symbol>
      <symbol
        id="i-clock"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </symbol>
    </svg>
  );
}

export type IconName =
  | "whatsapp"
  | "mail"
  | "instagram"
  | "cut"
  | "layers"
  | "ruler"
  | "pin"
  | "clock";

export function Icon({
  name,
  className,
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("size-6 shrink-0 overflow-visible", className)}
      {...props}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
