/**
 * Système de personnalisation des thèmes Nekama.
 * Couleurs d'accentuation (boutons/néons) et ambiances de fond de l'interface.
 */

export interface ThemeColor {
  id: string;
  name: string;
  hex: string;
  hoverHex: string;
  glow: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  bgHex: string;
  cardHex: string;
  description: string;
}

export const THEME_COLORS: ThemeColor[] = [
  {
    id: "violet",
    name: "Violet Otaku",
    hex: "#8B5CF6",
    hoverHex: "#7C3AED",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  {
    id: "cyan",
    name: "Cyan Cyberpunk",
    hex: "#06B6D4",
    hoverHex: "#0891B2",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    id: "rose",
    name: "Rose Sakura",
    hex: "#EC4899",
    hoverHex: "#DB2777",
    glow: "rgba(236, 72, 153, 0.4)",
  },
  {
    id: "orange",
    name: "Orange Shōnen",
    hex: "#F97316",
    hoverHex: "#EA580C",
    glow: "rgba(249, 115, 22, 0.4)",
  },
  {
    id: "vert",
    name: "Vert Émeraude",
    hex: "#10B981",
    hoverHex: "#059669",
    glow: "rgba(16, 185, 129, 0.4)",
  },
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "nekama-night",
    name: "Nekama Nuit",
    bgHex: "#0a0e27",
    cardHex: "#111638",
    description: "Ambiance nocturne officielle Nekama",
  },
  {
    id: "noir-oled",
    name: "Noir Pur OLED",
    bgHex: "#000000",
    cardHex: "#0d0e15",
    description: "Contraste absolu et économie d'énergie",
  },
  {
    id: "nebuleuse",
    name: "Nébuleuse Violette",
    bgHex: "#0d0824",
    cardHex: "#180f3e",
    description: "Reflets cosmiques et manga fantastique",
  },
  {
    id: "cyber-slate",
    name: "Cyber Ardoise",
    bgHex: "#0b1329",
    cardHex: "#14203e",
    description: "Bleu profond technologique et cyberpunk",
  },
];

export const DEFAULT_THEME_COLOR = THEME_COLORS[0]; // Violet Otaku (#8B5CF6)
export const DEFAULT_BG_THEME = BACKGROUND_PRESETS[0]; // Nekama Nuit (#0a0e27)

/**
 * Applique la couleur de bouton / accentuation sélectionnée aux variables CSS globales
 * et persiste le choix dans localStorage.
 */
export function applyThemeColor(hex: string) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--primary", hex);
  root.style.setProperty("--ring", hex);
  root.style.setProperty("--accent", hex);

  try {
    localStorage.setItem("nekama_theme_color", hex);
    // On met aussi à jour la couleur favorite par défaut si non définie
    if (!localStorage.getItem("nekama_favorite_color")) {
      localStorage.setItem("nekama_favorite_color", hex);
    }
  } catch (e) {
    console.warn("Erreur sauvegarde couleur thème", e);
  }
}

/**
 * Récupère la couleur de bouton / accentuation enregistrée ou la couleur par défaut.
 */
export function getSavedThemeColor(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_COLOR.hex;
  try {
    const saved = localStorage.getItem("nekama_theme_color");
    if (saved && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_THEME_COLOR.hex;
}

/**
 * Définit et persiste la couleur favorite de l'utilisateur (affichée dans le header).
 */
export function setFavoriteAccentColor(hex: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("nekama_favorite_color", hex);
  } catch (e) {
    console.warn("Erreur sauvegarde couleur favorite", e);
  }
}

/**
 * Récupère la couleur favorite (affichée dans le header).
 */
export function getFavoriteAccentColor(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_COLOR.hex;
  try {
    const saved = localStorage.getItem("nekama_favorite_color");
    if (saved && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return getSavedThemeColor();
}

/**
 * Applique la couleur de fond de l'interface et de la carte
 */
export function applyBackgroundColor(bgHex: string, cardHex?: string) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--background", bgHex);
  if (cardHex) {
    root.style.setProperty("--card", cardHex);
    root.style.setProperty("--popover", cardHex);
  }

  try {
    localStorage.setItem("nekama_bg_color", bgHex);
    if (cardHex) {
      localStorage.setItem("nekama_card_color", cardHex);
    }
  } catch (e) {
    console.warn("Erreur sauvegarde couleur fond", e);
  }
}

/**
 * Récupère la couleur de fond enregistrée
 */
export function getSavedBackgroundColor(): { bg: string; card: string } {
  if (typeof window === "undefined") {
    return { bg: DEFAULT_BG_THEME.bgHex, card: DEFAULT_BG_THEME.cardHex };
  }
  try {
    const bg = localStorage.getItem("nekama_bg_color");
    const card = localStorage.getItem("nekama_card_color");
    return {
      bg: bg || DEFAULT_BG_THEME.bgHex,
      card: card || DEFAULT_BG_THEME.cardHex,
    };
  } catch {
    return { bg: DEFAULT_BG_THEME.bgHex, card: DEFAULT_BG_THEME.cardHex };
  }
}
