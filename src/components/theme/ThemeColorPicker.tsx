"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { THEME_COLORS, applyThemeColor, getSavedThemeColor } from "@/lib/theme/themeColors";

interface ThemeColorPickerProps {
  compact?: boolean;
  showLabels?: boolean;
  className?: string;
}

/**
 * Sélecteur de couleur de thème Otaku / Nekama.
 * Affiche les 5 couleurs préférées sous forme de pastilles interactives.
 */
export default function ThemeColorPicker({
  compact = true,
  showLabels = false,
  className = "",
}: ThemeColorPickerProps) {
  const [currentColor, setCurrentColor] = useState<string>(THEME_COLORS[0].hex);

  useEffect(() => {
    const saved = getSavedThemeColor();
    setCurrentColor(saved);
    applyThemeColor(saved);
  }, []);

  const handleSelect = (hex: string) => {
    setCurrentColor(hex);
    applyThemeColor(hex);
  };

  return (
    <div
      className={`flex items-center gap-1.5 p-1 rounded-2xl bg-card/60 border border-border/80 backdrop-blur-sm ${className}`}
      role="radiogroup"
      aria-label="Choisir la couleur du thème"
    >
      {THEME_COLORS.map((color) => {
        const isSelected = currentColor.toLowerCase() === color.hex.toLowerCase();

        return (
          <motion.button
            key={color.id}
            type="button"
            onClick={() => handleSelect(color.hex)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={color.name}
            aria-label={color.name}
            aria-checked={isSelected}
            role="radio"
            style={{ backgroundColor: color.hex }}
            className={`relative flex items-center justify-center rounded-full transition-all focus:outline-none ${
              compact ? "size-6" : "size-8"
            } ${
              isSelected
                ? "ring-2 ring-white/90 shadow-[0_0_12px] shadow-current scale-105"
                : "opacity-75 hover:opacity-100 ring-1 ring-black/20"
            }`}
          >
            {isSelected && (
              <Check
                size={compact ? 12 : 14}
                className="text-white drop-shadow-md stroke-[3]"
              />
            )}
            {showLabels && (
              <span className="sr-only">{color.name}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
