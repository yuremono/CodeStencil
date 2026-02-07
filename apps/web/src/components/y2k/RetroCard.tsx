import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const retroCardVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#c0c0c0] border-2 border-[#808080]",
        neon: "bg-[#1a0a2e] border-2 border-[#ff00ff] shadow-[0_0_10px_#ff00ff]",
        matrix: "bg-[#000000] border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00]",
        vaporwave: "bg-gradient-to-br from-[#ff6ec7] to-[#7873f5] border-2 border-[#00ffff]",
      },
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface RetroCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof retroCardVariants> {
  title?: string;
  subtitle?: string;
  showScanlines?: boolean;
}

const RetroCard = React.forwardRef<HTMLDivElement, RetroCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      subtitle,
      showScanlines = false,
      children,
      ...props
    },
    ref
  ) => {
    const isNeon = variant === "neon";
    const isMatrix = variant === "matrix";

    return (
      <div
        ref={ref}
        className={cn(
          retroCardVariants({ variant, size }),
          "rounded-sm",
          className
        )}
        {...props}
      >
        {/* Scanlines effect */}
        {showScanlines && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              "bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]"
            )}
          />
        )}

        {/* Corner decorations for retro style */}
        {(variant === "default" || variant === "neon" || variant === "matrix") && (
          <>
            <div
              className={cn(
                "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2",
                variant === "default" ? "border-[#808080]" : "border-current"
              )}
            />
            <div
              className={cn(
                "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2",
                variant === "default" ? "border-[#808080]" : "border-current"
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2",
                variant === "default" ? "border-[#808080]" : "border-current"
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2",
                variant === "default" ? "border-[#808080]" : "border-current"
              )}
            />
          </>
        )}

        {/* Content */}
        <div className="relative z-10">
          {(title || subtitle) && (
            <div className="mb-3 pb-2 border-b border-current/20">
              {title && (
                <h3
                  className={cn(
                    "font-mono font-bold",
                    isNeon && "text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff]",
                    isMatrix && "text-[#00ff00] drop-shadow-[0_0_5px_#00ff00]",
                    variant === "default" && "text-black"
                  )}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className={cn(
                    "text-xs font-mono mt-1",
                    isNeon && "text-[#00ffff]",
                    isMatrix && "text-[#00ff00]",
                    variant === "default" && "text-[#808080]"
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
);

RetroCard.displayName = "RetroCard";

export { RetroCard, retroCardVariants };
