import { Skeleton } from "@/components/ui/skeleton";
import type { Photo } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Fills the photo's box until the (opaque) photo paints over it: a blurred
 * preview for real photos, a skeleton for transparent placeholders. Match the
 * photo's object-position/scale through `className` so the two line up.
 */
export function PhotoPlaceholder({
  image,
  className,
}: {
  image: Photo;
  className?: string;
}) {
  if (!image.blur) {
    return (
      <Skeleton
        aria-hidden="true"
        className={cn("absolute inset-0 rounded-none", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 bg-cover", className)}
      style={{ backgroundImage: `url("${image.blur}")` }}
    />
  );
}
