import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface";
  hoverable?: boolean;
  children: React.ReactNode;
}

export default function Card({
  variant = "default",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4",
        variant === "default" && "bg-card shadow-sm border border-border/50",
        variant === "surface" && "bg-background",
        hoverable && "transition-shadow hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
