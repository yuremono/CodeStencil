import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pixelButtonVariants = cva(
  "inline-flex items-center justify-center font-mono text-sm transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#c0c0c0] text-black border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080]",
        primary:
          "bg-[#000080] text-white border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white",
        success:
          "bg-[#008000] text-white border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white",
        danger:
          "bg-[#800000] text-white border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white",
      },
      size: {
        default: "h-8 px-4 py-1",
        sm: "h-6 px-2 py-0.5 text-xs",
        lg: "h-10 px-6 py-2 text-base",
      },
      state: {
        default: "",
        active: "border-t-0 border-l-0 border-b-2 border-r-2 border-[#808080]",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean;
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, state, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          pixelButtonVariants({ variant, size, state: disabled ? "disabled" : state }),
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);
PixelButton.displayName = "PixelButton";

export { PixelButton, pixelButtonVariants };
