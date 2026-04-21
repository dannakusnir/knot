import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-[7px]">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-sans text-[11.5px] font-semibold tracking-[0.02em] text-[color:var(--ink-mid)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[14px] border bg-[color:var(--surface)] px-4 py-3 text-[14px] font-medium text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] transition-colors focus:outline-none focus:ring-2 resize-none leading-[1.5]",
            error
              ? "border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]/30"
              : "border-[color:var(--line)] focus:ring-[color:var(--sage)]/30 focus:border-[color:var(--sage)]/40",
            className
          )}
          rows={4}
          {...props}
        />
        {error && (
          <p className="font-sans text-[11.5px] text-[color:var(--destructive)] font-medium mt-[6px]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
