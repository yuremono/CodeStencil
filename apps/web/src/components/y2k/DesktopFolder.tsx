import * as React from "react";
import { cn } from "@/lib/utils";

export interface DesktopFolderProps {
  icon?: React.ReactNode;
  label: string;
  isOpen?: boolean;
  className?: string;
  onClick?: () => void;
}

const DefaultFolderIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("transition-colors", isOpen ? "text-yellow-300" : "text-yellow-400")}
  >
    {/* Folder tab */}
    <rect x="4" y="6" width="16" height="6" fill="currentColor" />
    {/* Folder body */}
    <rect x="2" y="12" width="44" height="28" rx="2" fill="currentColor" />
    {/* Folder highlight */}
    <rect x="4" y="14" width="40" height="24" rx="1" fill="rgba(255,255,255,0.3)" />
    {/* Folder front */}
    <rect x="2" y="20" width="44" height="20" rx="2" className="text-yellow-500" fill="currentColor" />
  </svg>
);

const DesktopFolder = React.forwardRef<HTMLDivElement, DesktopFolderProps>(
  ({ icon, label, isOpen = false, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center gap-2 p-2 cursor-pointer select-none group",
          "hover:bg-white/10 rounded transition-colors",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="relative">
          {icon || <DefaultFolderIcon isOpen={isOpen} />}
          {isOpen && (
            <div className="absolute inset-0 bg-white/20 rounded" />
          )}
        </div>
        <span
          className={cn(
            "text-xs font-mono text-white px-1 py-0.5 rounded",
            "bg-black/50 backdrop-blur-sm",
            "group-hover:bg-blue-600 group-hover:text-white",
            "transition-colors text-center max-w-[80px] truncate"
          )}
        >
          {label}
        </span>
      </div>
    );
  }
);

DesktopFolder.displayName = "DesktopFolder";

export { DesktopFolder };
