import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div className="rounded-full bg-[#DDBEA9]/20 p-4 mb-4">
        <Icon className="h-8 w-8 text-[#CB997E]" />
      </div>
      <h3 className="text-lg font-semibold font-serif text-[#3D3229] mb-1">{title}</h3>
      <p className="text-sm text-[#8A8078] max-w-xs mb-4">
        {description}
      </p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
