// src/components/main/navConstants.ts
import { Home, User, Gamepad2, Bell, Search } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import DynamicProfileIcon from "./DynamicProfileIcon";

export interface NavItem {
  label: string;
  href: string;
  // 🔹 Accepte : icône Lucide OU composant personnalisé
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>> ;
  badge?: boolean;
}

// ── Items principaux ───────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil",      href: "/feed",     icon: Home      },
  { label: "Recherche",    href: "/search",   icon: Search    },
  { label: "Jeux",         href: "/game",     icon: Gamepad2  },
  { label: "Profil",       href: "/profile",  icon: User      },
  // Icône par défaut (sera remplacée dans TopBar)
];


// ── Items droite TopBar ────────────────────────────────────
export const TOPBAR_RIGHT: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell, badge: true },
  { label: "Profil",        href: "/profile",        icon: DynamicProfileIcon }, // ✅ Composant personnalisé
];