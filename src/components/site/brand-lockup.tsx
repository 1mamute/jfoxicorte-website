import { cn } from "@/lib/utils";

import { LogoMark } from "./logo-mark";

/**
 * Logo symbol + live-text wordmark. Font sizes use container query units so
 * the wordmark always matches the lockup width (the original logo proportions).
 */
export function BrandLockup({
  tagline = false,
  className,
}: {
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "@container flex w-full flex-col items-center gap-1.5",
        className,
      )}
    >
      <LogoMark className="aspect-square w-[38%]" />
      <span className="block w-full translate-x-[0.068em] text-center font-brand text-[16.69cqw] leading-[1.24] font-semibold whitespace-nowrap">
        JF OXICORTE
      </span>
      {tagline && (
        <span className="block w-full text-center font-brand text-[7.45cqw] leading-[1.35] font-semibold whitespace-nowrap">
          CORTE E DOBRA DE CHAPAS
        </span>
      )}
    </span>
  );
}
