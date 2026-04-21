import { Check } from "lucide-react";

export interface TimelineStep {
  label: string;
  meta?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  active: number;
}

export default function Timeline({ steps, active }: TimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const done = i < active;
        const current = i === active;
        const isLast = i === steps.length - 1;

        return (
          <div
            key={i}
            className="flex gap-3.5 relative"
            style={{ paddingBottom: isLast ? 0 : 22 }}
          >
            <div className="relative shrink-0">
              <div
                className={
                  "w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 " +
                  (done
                    ? "bg-[color:var(--sage)] border-[color:var(--sage)]"
                    : current
                    ? "bg-[color:var(--sage-soft)] border-[color:var(--sage)]"
                    : "bg-[color:var(--surface)] border-[color:var(--line)]")
                }
              >
                {done && (
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                )}
                {current && (
                  <span className="w-[7px] h-[7px] rounded-full bg-[color:var(--sage)] animate-pulse-dot" />
                )}
              </div>
              {!isLast && (
                <div
                  className={
                    "absolute top-[28px] left-1/2 -translate-x-1/2 w-[2px] " +
                    (done ? "bg-[color:var(--sage)]" : "bg-[color:var(--line)]")
                  }
                  style={{ height: "calc(100% + 5px)" }}
                />
              )}
            </div>

            <div className="flex-1 pt-0.5">
              <p
                className={
                  "text-[13px] leading-tight " +
                  (done || current
                    ? "font-semibold text-[color:var(--ink)]"
                    : "font-medium text-[color:var(--ink-soft)]")
                }
              >
                {step.label}
              </p>
              {step.meta && (
                <p className="text-[11px] text-[color:var(--ink-soft)] mt-[3px]">
                  {step.meta}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
