import { cn } from "@/lib/utils";

interface KnotLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
};

export default function KnotLogo({ size = "md", className }: KnotLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size], "w-auto")}
      >
        <path
          d="M20 8c-4 0-7 3-7 7 0 2.5 1.2 4.7 3 6l4 4 4-4c1.8-1.3 3-3.5 3-6 0-4-3-7-7-7z"
          stroke="#A3B18A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 32c4 0 7-3 7-7 0-2.5-1.2-4.7-3-6l-4-4-4 4c-1.8 1.3-3 3.5-3 6 0 4 3 7 7 7z"
          stroke="#A3B18A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
        KNOT
      </span>
    </div>
  );
}
