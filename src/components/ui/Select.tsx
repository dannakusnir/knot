import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "w-full appearance-none rounded-[14px] border bg-[color:var(--surface)] px-4 h-12 pr-10 text-[14px] font-medium text-[color:var(--ink)] transition-colors focus:outline-none focus:ring-2",
              error
                ? "border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]/30"
                : "border-[color:var(--line)] focus:ring-[color:var(--sage)]/30 focus:border-[color:var(--sage)]/40",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--ink-soft)] pointer-events-none"
            strokeWidth={1.6}
          />
        </div>
        {error && (
          <p className="font-sans text-[11.5px] text-[color:var(--destructive)] font-medium mt-[6px]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
