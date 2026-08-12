// ============================================================
// components/ui/Button.tsx — Bouton réutilisable
// ============================================================

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // twMerge helper (voir note bas)

export type Variant = "primary" | "secondary" | "ghost" | "danger";
export type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: `
    bg-violet-600 hover:bg-violet-500 active:bg-violet-700
    text-white shadow-[0_0_20px_rgba(139,95,230,0.3)]
    hover:shadow-[0_0_28px_rgba(139,95,230,0.5)]
    border border-violet-500/30
  `,
  secondary: `
    bg-[#1a2040] hover:bg-[#222a50] active:bg-[#151a35]
    text-gray-300 hover:text-white
    border border-[#2D3748] hover:border-violet-500/40
  `,
  ghost: `
    bg-transparent hover:bg-white/5
    text-gray-400 hover:text-white
    border border-transparent hover:border-white/10
  `,
  danger: `
    bg-red-900/30 hover:bg-red-900/50
    text-red-400 hover:text-red-300
    border border-red-800/40
  `,
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-3 py-2 rounded-lg min-h-[36px]",
  md: "text-sm px-5 py-3 rounded-xl min-h-[48px]",
  lg: "text-base px-6 py-4 rounded-xl min-h-[56px]",
};

/**
 * Classes de style du bouton, applicables à un élément autre que <button>.
 * Nécessaire pour les primitives Radix (AlertDialog) : les imbriquer dans
 * un <button> produirait un bouton dans un bouton, donc du HTML invalide.
 */
export const buttonClasses = (
  variant: Variant = "primary",
  size: Size = "md",
  fullWidth = false
) =>
  cn(
    // Base
    "relative inline-flex items-center justify-center gap-2",
    "font-semibold tracking-wide",
    "transition-all duration-200 ease-out",
    "cursor-pointer select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    // Variant & size
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full"
  );

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(buttonClasses(variant, size, fullWidth), className)}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Les deux styles d'import coexistent dans le projet :
// `import Button from ...` (InputField, ProfileHeader) et
// `import { Button } from ...` (carousel, alert-dialog).
export { Button };