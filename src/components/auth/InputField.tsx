"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputFieldProps } from "@/lib/types";

/**
 * Champ de saisie réutilisable pour les formulaires d'authentification.
 * Gère les types texte, email et mot de passe (avec toggle de visibilité).
 * Utilise les variables sémantiques Tailwind pour s'adapter au thème clair/sombre.
 *
 * @component
 * @param {string} props.label - Le libellé affiché au-dessus du champ.
 * @param {"text" | "email" | "password"} props.type - Le type d'input HTML.
 * @param {string} props.placeholder - Le texte indicatif dans le champ vide.
 * @param {UseFormRegisterReturn} props.registration - L'objet de registration react-hook-form.
 * @param {string} [props.error] - Le message d'erreur de validation à afficher.
 * @param {string} [props.autoComplete] - L'attribut autocomplete HTML.
 * @returns {JSX.Element} Le champ de saisie stylisé.
 */
export default function InputField({
  label,
  type,
  placeholder,
  registration,
  error,
  autoComplete,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      <label className="text-[11px] font-bold text-muted-foreground tracking-[0.08em] uppercase">
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          {...registration}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 ${
            error
              ? "border-red-500/60 focus:border-red-500"
              : "border-border focus:border-[#FF3E00] focus:bg-[#FF3E00]/[0.03]"
          }`}
        />

        {/* Toggle password visibility */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <span className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
          <span className="size-1 rounded-full bg-red-500 shrink-0" />
          {error}
        </span>
      )}
    </div>
  );
}