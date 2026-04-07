import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { KnotStatus } from "@/types";

interface KnotTimelineProps {
  status: KnotStatus;
}

const steps = [
  { key: "connected", label: "Connected" },
  { key: "in_progress", label: "In Progress" },
  { key: "proof_submitted", label: "Proof Submitted" },
  { key: "completed", label: "Completed" },
];

const statusOrder: Record<string, number> = {
  connected: 0,
  in_progress: 1,
  proof_submitted: 2,
  revision_requested: 2,
  completed: 3,
  cancelled: -1,
};

export default function KnotTimeline({ status }: KnotTimelineProps) {
  const currentIndex = statusOrder[status] ?? 0;

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    isCompleted || isCurrent ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "bg-primary/20 text-primary-hover border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "text-[10px] mt-1 text-center",
                isCurrent
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
