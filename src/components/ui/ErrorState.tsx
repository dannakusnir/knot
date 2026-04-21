import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("min-h-dvh bg-[color:var(--cream)] flex items-center justify-center px-6", className)}>
      <div className="text-center max-w-sm">
        <div className="rounded-full w-[72px] h-[72px] bg-[color:var(--destructive-soft)] border border-[color:var(--destructive)]/20 flex items-center justify-center mx-auto mb-5">
          <Icon className="h-7 w-7 text-[color:var(--destructive)]" strokeWidth={1.5} />
        </div>
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] uppercase text-[color:var(--destructive)]">
          Something broke
        </span>
        <h3 className="mt-3 font-serif italic text-[26px] font-medium text-[color:var(--ink)] leading-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-3 text-[14px] leading-[1.55] text-[color:var(--ink-mid)] font-medium">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-6">
            {action.href ? (
              <Link
                href={action.href}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)] px-6 font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase"
              >
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--cream)] px-6 font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase"
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
