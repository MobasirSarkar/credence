import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 border-[#2C40A7] px-2.5 py-0.5 text-xs font-bold font-mono tracking-wide transition-all",
  {
    variants: {
      variant: {
        default: "bg-[#F237A1] text-white shadow-[2px_2px_0px_#2C40A7]",
        secondary: "bg-[#FDE8F3] text-[#2C40A7] shadow-[2px_2px_0px_#2C40A7]",
        destructive: "bg-[#DC2626] text-white shadow-[2px_2px_0px_#2C40A7]",
        outline: "bg-[#FFFDF8] text-[#2C40A7]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
