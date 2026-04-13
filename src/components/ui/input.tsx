// ============================================================
// components/ui/Input.tsx — Input & Textarea réutilisables
// ============================================================

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ── Base styles partagés ─────────────────────────────────────
const baseClass = `
  w-full bg-[#0d1230] border border-[#2D3748] text-white
  rounded-xl px-4 py-3 text-sm
  placeholder:text-gray-600
  focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30
  transition-all duration-200
  min-h-[48px]
`;

const readonlyClass = `
  w-full bg-[#090d22] border border-[#1e2540] text-gray-400
  rounded-xl px-4 py-3 text-sm min-h-[48px]
  flex items-center cursor-default select-text
`;

// ── Input ────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-widest text-gray-500"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseClass, error && "border-red-500 focus:border-red-500", className)}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── Textarea ─────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, maxLength, currentLength, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-widest text-gray-500"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            baseClass,
            "resize-none leading-relaxed",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
          {maxLength !== undefined && currentLength !== undefined && (
            <p
              className={cn(
                "text-xs ml-auto",
                currentLength > maxLength * 0.9 ? "text-amber-400" : "text-gray-600"
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ── ReadonlyField ────────────────────────────────────────────
interface ReadonlyFieldProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function ReadonlyField({ label, value, hint, className }: ReadonlyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <div className={cn(readonlyClass, className)}>
        {value || <span className="text-gray-600 italic">Non renseigné</span>}
      </div>
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}