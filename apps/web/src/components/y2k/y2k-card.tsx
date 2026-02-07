import React from "react";
import { cn } from "@/lib/utils";

interface Y2KCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Y2KCard({ children, className, title }: Y2KCardProps) {
  return (
    <div className={cn("y2k-card", className)}>
      {title && (
        <div className="y2k-title-bar mb-4">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

interface Y2KWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Y2KWindow({ children, className, title }: Y2KWindowProps) {
  return (
    <div className={cn("y2k-window", className)}>
      {title && (
        <div className="y2k-title-bar flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-1">
            <button className="w-4 h-4 bg-gray-300 border border-white text-xs leading-none">_</button>
            <button className="w-4 h-4 bg-gray-300 border border-white text-xs leading-none">□</button>
            <button className="w-4 h-4 bg-red-500 border border-white text-xs leading-none">×</button>
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
