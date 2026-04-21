import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Button from "./Button";

type EmptyStateTone = "sage" | "clay" | "neutral";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: EmptyStateTone;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const toneStyles: Record<EmptyStateTone, { bg: string; fg: string }> = {
  sage: { bg: "bg-[color:var(--sage-tint)]", fg: "text-[color:var(--sage-deep)]" },
  clay: { bg: "bg-[color:var(--clay-soft)]", fg: "text-[color:var(--clay-deep)]" },
  neutral: { bg: "bg-[color:var(--paper)]", fg: "text-[color:var(--ink-soft)]" },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  tone = "sage",
  action,
  className,
}: EmptyStateProps) {
  const t = toneStyles[tone];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 px-6 text-center",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full w-[72px] h-[72px] border border-[color:var(--line)] flex items-center justify-center mb-5",
          t.bg
        )}
      >
        <Icon className={cn("h-7 w-7", t.fg)} strokeWidth={1.5} />
      </div>
      <h3 className="font-serif italic text-[22px] font-medium text-[color:var(--ink)] mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-[13px] leading-[1.55] text-[color:var(--ink-soft)] max-w-[240px] font-medium">
        {description}
      </p>
      {action && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
