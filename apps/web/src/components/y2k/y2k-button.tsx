import React from "react";
import { cn } from "@/lib/utils";

interface Y2KButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Y2KButton({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: Y2KButtonProps) {
  const variantStyles = {
    default: "y2k-button",
    primary: "y2k-button y2k-button-primary",
    secondary: "y2k-button y2k-button-secondary",
    accent: "y2k-button y2k-button-accent",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
