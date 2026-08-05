import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border-2 border-[#2C40A7] font-sans font-bold text-sm whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#F237A1] text-white shadow-[3px_3px_0px_#2C40A7] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2C40A7] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#2C40A7]",
        outline:
          "bg-[#FFFDF8] text-[#2C40A7] shadow-[3px_3px_0px_#2C40A7] hover:bg-[#FDE8F3] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2C40A7] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#2C40A7]",
        secondary:
          "bg-[#FDE8F3] text-[#2C40A7] shadow-[3px_3px_0px_#2C40A7] hover:bg-[#F237A1] hover:text-white hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2C40A7] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#2C40A7]",
        ghost:
          "border-transparent bg-transparent text-[#2C40A7] hover:bg-[#FDE8F3] hover:border-[#2C40A7]",
        destructive:
          "bg-[#DC2626] text-white shadow-[3px_3px_0px_#2C40A7] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#2C40A7] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_#2C40A7]",
        link: "border-transparent text-[#2C40A7] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 gap-2",
        xs: "h-7 px-2.5 text-xs gap-1",
        sm: "h-8 px-3 text-xs gap-1.5",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
