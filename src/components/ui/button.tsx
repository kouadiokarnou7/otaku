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

// Toutes les couleurs viennent des tokens de globals.css.
// Aucune valeur en dur ici : changer la marque se fait dans :root.
const variantStyles: Record<Variant, string> = {
  primary: `
    bg-primary hover:bg-brand-light active:bg-brand-dark
    text-primary-foreground
    shadow-[0_0_20px_var(--o-glow)]
    hover:shadow-[0_0_28px_var(--o-glow-s)]
    border border-brand-border
  `,
  secondary: `
    bg-secondary hover:bg-surface-2 active:bg-surface
    text-secondary-foreground/80 hover:text-secondary-foreground
    border border-border hover:border-brand-border
  `,
  ghost: `
    bg-transparent hover:bg-accent
    text-muted-foreground hover:text-foreground
    border border-transparent hover:border-border
  `,
  danger: `
    bg-destructive/20 hover:bg-destructive/35
    text-destructive-foreground/80 hover:text-destructive-foreground
    border border-destructive/40
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