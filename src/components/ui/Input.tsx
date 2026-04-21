"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

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
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "w-full rounded-[14px] border bg-[color:var(--surface)] px-4 h-12 text-[14px] font-medium text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] transition-colors focus:outline-none focus:ring-2",
              error
                ? "border-[color:var(--destructive)] focus:ring-[color:var(--destructive)]/30"
                : "border-[color:var(--line)] focus:ring-[color:var(--sage)]/30 focus:border-[color:var(--sage)]/40",
              isPassword && "pr-10",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.6} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.6} />
              )}
            </button>
          )}
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

Input.displayName = "Input";
export default Input;
