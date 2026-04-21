"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-7 px-3 text-[11px]",
  md: "h-[34px] px-3.5 text-[12px]",
  lg: "h-10 px-4 text-[13px]",
};

export default function Chip({
  label,
  active,
  onClick,
  size = "md",
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-semibold tracking-[0.01em] whitespace-nowrap transition-all active:scale-[0.97]",
        sizes[size],
        active
          ? "bg-[color:var(--ink)] text-[color:var(--cream)] border-[color:var(--ink)]"
          : "bg-[color:var(--surface)] text-[color:var(--ink)] border-[color:var(--line)]",
        className
      )}
    >
      {label}
    </button>
  );
}
