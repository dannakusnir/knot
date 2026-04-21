import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-[22px]",
};

const imageSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 80,
};

export default function Avatar({
  src,
  name,
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className={cn(
          "rounded-full object-cover shrink-0 ring-2 ring-[color:var(--cream)]",
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)] font-serif font-medium flex items-center justify-center shrink-0 ring-2 ring-[color:var(--cream)]",
        sizeStyles[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
