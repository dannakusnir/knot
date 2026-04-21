import { cn } from "@/lib/utils";

interface KnotLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "combined" | "mark" | "wordmark";
  className?: string;
}

const sizes = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
};

export default function KnotLogo({
  size = "md",
  variant = "combined",
  className,
}: KnotLogoProps) {
  const mark = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], "w-auto")}
    >
      <path
        d="M20 8c-4 0-7 3-7 7 0 2.5 1.2 4.7 3 6l4 4 4-4c1.8-1.3 3-3.5 3-6 0-4-3-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 32c4 0 7-3 7-7 0-2.5-1.2-4.7-3-6l-4-4-4 4c-1.8 1.3-3 3.5-3 6 0 4 3 7 7 7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const wordmark = (
    <span
      className="font-serif font-medium text-ink"
      style={{
        fontSize: size === "lg" ? 28 : size === "md" ? 20 : 16,
        letterSpacing: "0.25em",
      }}
    >
      KNOT
    </span>
  );

  if (variant === "mark") {
    return <div className={cn("text-ink", className)}>{mark}</div>;
  }

  if (variant === "wordmark") {
    return <div className={cn(className)}>{wordmark}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2 text-ink", className)}>
      {mark}
      {wordmark}
    </div>
  );
}
