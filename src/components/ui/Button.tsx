"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "sage"
  | "clay"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--sage)] text-white hover:bg-[color:var(--sage-deep)] border border-[color:var(--sage)] hover:border-[color:var(--sage-deep)]",
  sage:
    "bg-[color:var(--sage)] text-white hover:bg-[color:var(--sage-deep)] border border-[color:var(--sage)] hover:border-[color:var(--sage-deep)]",
  clay:
    "bg-[color:var(--clay)] text-white hover:bg-[color:var(--clay-deep)] border border-[color:var(--clay)] hover:border-[color:var(--clay-deep)]",
  secondary:
    "bg-[color:var(--clay)] text-white hover:bg-[color:var(--clay-deep)] border border-[color:var(--clay)]",
  outline:
    "border border-[color:var(--line)] bg-transparent text-[color:var(--ink)] hover:bg-[color:var(--paper)]",
  ghost:
    "bg-transparent text-[color:var(--ink)] hover:bg-[color:var(--paper)]",
  destructive:
    "bg-[color:var(--destructive)] text-white hover:opacity-90 border border-[color:var(--destructive)]",
  dark:
    "bg-[color:var(--ink)] text-[color:var(--cream)] hover:opacity-90 border border-[color:var(--ink)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[12.5px] tracking-[0.14em] uppercase rounded-full",
  md: "h-12 px-5 text-[13px] tracking-[0.14em] uppercase rounded-full",
  lg: "h-14 px-6 text-[13.5px] tracking-[0.14em] uppercase rounded-full",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sage)]/40 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
