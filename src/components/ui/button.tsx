import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-[5px] border px-[1.125rem] py-3.5 text-[0.8125rem] leading-normal font-semibold transition-[background,color,transform] duration-200 outline-none hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 xs:px-[1.4375rem] xs:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        metal:
          "border-white/15 bg-[linear-gradient(135deg,#4b5054_0%,#3c4145_42%,#282c30_100%)] text-foreground shadow-[inset_0_1px_0_#ffffff15,0_3px_12px_#0000001a] hover:bg-[linear-gradient(135deg,#565c61_0%,#464b50_42%,#34393e_100%)]",
        outline:
          "border-[#646464] bg-transparent text-white hover:bg-[#444648]",
      },
    },
    defaultVariants: { variant: "metal" },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
