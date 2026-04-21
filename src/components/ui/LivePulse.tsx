import { cn } from "@/lib/utils";

interface LivePulseProps {
  count?: number;
  label: string;
  className?: string;
}

export default function LivePulse({ count, label, className }: LivePulseProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-1.5",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--clay)] opacity-60 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--clay)]" />
      </span>
      {count !== undefined && (
        <span className="font-mono text-[11px] font-semibold tracking-wide text-ink">
          {count.toLocaleString()}
        </span>
      )}
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
        {label}
      </span>
    </div>
  );
}
