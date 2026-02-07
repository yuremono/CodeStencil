import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface Window95Props {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  showControls?: boolean;
}

const Window95 = React.forwardRef<HTMLDivElement, Window95Props>(
  (
    {
      title,
      isOpen = true,
      onClose,
      children,
      className,
      width = "400px",
      height = "auto",
      showControls = true,
      ...props
    },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-[#c0c0c0] border-2 border-[#dfdfdf] shadow-lg",
          "flex flex-col",
          className
        )}
        style={{ width, height }}
        {...props}
      >
        {/* Title bar */}
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1",
            "bg-[#000080] text-white font-mono text-sm",
            "border-b-2 border-[#808080]"
          )}
        >
          {showControls && (
            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className={cn(
                  "w-4 h-4 flex items-center justify-center",
                  "bg-[#c0c0c0] border-t border-l border-white",
                  "border-b border-r border-[#808080] text-[#000000]",
                  "hover:bg-[#dfdfdf] active:border-t-0 active:border-l-0",
                  "active:border-b active:border-r active:border-white"
                )}
              >
                <X size={10} />
              </button>
            </div>
          )}
          <span className="flex-1 truncate">{title}</span>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 overflow-auto">
          {children}
        </div>

        {/* Status bar */}
        <div
          className={cn(
            "flex items-center px-2 py-1 mt-auto",
            "border-t border-[#808080] text-xs font-mono text-[#000000]"
          )}
        >
          <span className="text-[#808080]">Ready</span>
        </div>
      </div>
    );
  }
);

Window95.displayName = "Window95";

export { Window95 };
