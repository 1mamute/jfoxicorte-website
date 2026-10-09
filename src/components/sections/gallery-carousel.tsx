"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Gallery, GallerySlide } from "@/content/home";
import { photo } from "@/lib/images";
import { cn } from "@/lib/utils";

type EmblaApi = ReturnType<typeof useEmblaCarousel>[1];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Selected index of an Embla instance plus wrap-around prev/next helpers. */
function useCarouselIndex(api: EmblaApi, count: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);

  const go = useCallback(
    (step: number) =>
      api?.scrollTo((index + step + count) % count, prefersReducedMotion()),
    [api, index, count],
  );

  return { index, go };
}

function slideStyle(slide: GallerySlide) {
  const zoom = Math.min(3, Math.max(1, slide.zoom ?? 1));
  return {
    "--zoom": zoom,
    "--pos": slide.position ?? "50% 50%",
  } as CSSProperties;
}

const arrowButton =
  "grid shrink-0 place-items-center rounded-full border border-white/40 bg-[#17171755] text-white transition-colors duration-200 hover:border-white/60 hover:bg-[#444648] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

function Controls({
  title,
  index,
  count,
  go,
  large = false,
}: {
  title: string;
  index: number;
  count: number;
  go: (step: number) => void;
  large?: boolean;
}) {
  const size = large
    ? "size-[38px] xs:size-[42px] bg-white/7"
    : "size-[30px] xs:size-[34px]";
  return (
    <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-[9px]">
      <button
        type="button"
        className={cn(arrowButton, size)}
        onClick={() => go(-1)}
        aria-label={`Foto anterior de ${title}`}
      >
        <ArrowLeft className="size-[17px]" aria-hidden="true" />
      </button>
      <span
        className={cn(
          "min-w-[30px] text-center text-xs text-[#eee] tabular-nums sm:min-w-[34px]",
          large && "min-w-11 text-sm sm:min-w-11",
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">Foto </span>
        {index + 1} <span aria-hidden="true">/</span>
        <span className="sr-only">de</span> {count}
      </span>
      <button
        type="button"
        className={cn(arrowButton, size)}
        onClick={() => go(1)}
        aria-label={`Próxima foto de ${title}`}
      >
        <ArrowRight className="size-[17px]" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Enlarged photos of one gallery, opened at the slide that was clicked. */
function Lightbox({
  gallery,
  startIndex,
  onCloseAutoFocus,
}: {
  gallery: Gallery;
  startIndex: number;
  onCloseAutoFocus: ComponentProps<typeof DialogContent>["onCloseAutoFocus"];
}) {
  const count = gallery.slides.length;
  const [ref, api] = useEmblaCarousel({
    loop: count > 1,
    startIndex,
    duration: 28,
  });
  const { index, go } = useCarouselIndex(api, count);
  const slide = gallery.slides[index] ?? gallery.slides[0];

  return (
    <DialogContent
      showCloseButton={false}
      onCloseAutoFocus={onCloseAutoFocus}
      className="block w-[calc(100vw-28px)] max-w-[1100px] rounded-none border-0 bg-transparent p-0 text-white shadow-none xs:w-[calc(100vw-40px)] sm:p-0"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
      }}
    >
      <DialogClose className="absolute -top-12 -right-0.5 z-10 grid size-[42px] place-items-center rounded-full transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white">
        <XIcon className="size-6" aria-hidden="true" />
        <span className="sr-only">Fechar galeria</span>
      </DialogClose>

      <div
        ref={ref}
        className="h-[min(68dvh,calc(100dvh-160px),740px)] cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
      >
        <div className="flex h-full">
          {gallery.slides.map((item, i) => {
            const image = photo(item.photo);
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="foto"
                aria-label={`${i + 1} de ${count}`}
                inert={i !== index}
                className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center overflow-hidden"
                style={slideStyle(item)}
              >
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="min(1100px, 100vw)"
                  width={image.width}
                  height={image.height}
                  alt={item.alt}
                  draggable={false}
                  decoding="async"
                  className="size-full [scale:var(--zoom)] object-contain object-(--pos) select-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-[74px] items-center justify-between gap-3 px-0.5 pt-3.5 xs:gap-6 xs:pt-[18px]">
        <div className="min-w-0">
          <DialogTitle className="text-base leading-[1.3] font-semibold tracking-normal text-white xs:text-[1.05rem]">
            {gallery.title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-[0.8125rem] leading-[1.4] text-[#e4e4e4] xs:text-sm">
            {slide.label}
          </DialogDescription>
        </div>
        {count > 1 && (
          <Controls
            title={gallery.title}
            index={index}
            count={count}
            go={go}
            large
          />
        )}
      </div>
    </DialogContent>
  );
}

/** Photo tile of the projects grid: a small carousel that opens a lightbox. */
export function GalleryCarousel({
  gallery,
  sizes,
  className,
}: {
  gallery: Gallery;
  sizes: string;
  className?: string;
}) {
  const count = gallery.slides.length;
  const [ref, api] = useEmblaCarousel({ loop: count > 1, duration: 24 });
  const { index, go } = useCarouselIndex(api, count);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Fotos de ${gallery.title}`}
      className={cn(
        "relative isolate min-w-0 overflow-hidden bg-[#242424] text-white",
        className,
      )}
    >
      <div ref={ref} className="h-full touch-pan-y overflow-hidden">
        <div className="flex h-full">
          {gallery.slides.map((slide, i) => {
            const image = photo(slide.photo);
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${count}`}
                inert={i !== index}
                className="relative h-full min-w-0 flex-[0_0_100%]"
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`Ampliar foto: ${slide.alt}`}
                  className="group/photo relative block size-full overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(0deg,#000b,transparent_55%)] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                  style={slideStyle(slide)}
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setLightboxStart(i);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes={sizes}
                    width={image.width}
                    height={image.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="size-full [scale:var(--zoom)] object-cover object-(--pos) transition-[scale] duration-500 select-none group-hover/photo:[scale:calc(var(--zoom)+.035)]"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 bottom-[59px] z-[1] text-base leading-[1.6] tracking-[-0.02em] text-white sm:inset-x-[17px] sm:bottom-[65px] md:inset-x-[25px] md:bottom-[68px] md:text-[1.3rem]"
      >
        {gallery.title}
        <small className="mt-[5px] block text-[0.625rem] tracking-[0.06em] text-[#c2c2c2] uppercase sm:tracking-[0.13em] md:text-[0.6875rem]">
          {gallery.caption}
        </small>
      </p>

      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-2.5 bottom-[13px] z-[2] flex items-center justify-center gap-2 sm:inset-x-[17px] sm:justify-between md:inset-x-[25px] md:bottom-[15px] md:gap-3">
          <span
            className="hidden text-xs tracking-[0.02em] text-[#d8d8d8] sm:block"
            aria-hidden="true"
          >
            {gallery.slides[index]?.label}
          </span>
          <Controls title={gallery.title} index={index} count={count} go={go} />
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Lightbox
          key={lightboxStart}
          gallery={gallery}
          startIndex={lightboxStart}
          onCloseAutoFocus={(event) => {
            // The dialog is controlled, so Radix has no trigger to refocus.
            event.preventDefault();
            opener.current?.focus({ preventScroll: true });
          }}
        />
      </Dialog>
    </div>
  );
}
