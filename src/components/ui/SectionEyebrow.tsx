import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  num?: string;
  label: string;
  className?: string;
  accent?: boolean;
}

export default function SectionEyebrow({
  num,
  label,
  className,
  accent,
}: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
        accent ? "text-[color:var(--sage-deep)]" : "text-[color:var(--ink-soft)]",
        className
      )}
    >
      {num && <span className="mr-2">§ {num}</span>}
      <span>{label}</span>
    </p>
  );
}
