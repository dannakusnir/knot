import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "sage"
  | "clay"
  | "sand"
  | "peach"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[color:var(--line-soft)] text-[color:var(--ink-mid)]",
  sage: "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]",
  clay: "bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]",
  sand: "bg-[color:var(--sand)] text-[color:var(--sand-ink)]",
  peach: "bg-[color:var(--peach)] text-[color:var(--peach-ink)]",
  primary: "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]",
  secondary: "bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]",
  success: "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]",
  warning: "bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]",
  destructive:
    "bg-[color:var(--destructive-soft)] text-[color:var(--destructive)]",
  info: "bg-[#D9E2E8] text-[color:var(--info)]",
  outline:
    "border border-[color:var(--line)] text-[color:var(--ink-mid)] bg-transparent",
};

export default function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.01em]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
