import { Home, Compass, Plus, Bell, User, Gamepad2 } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import DynamicProfileIcon from "./DynamicProfileIcon";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
  badge?: boolean;
}

// ── 5 Items principaux du BottomBar Nekama (Mobile) ─────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil",       href: "/feed",          icon: Home     },
  { label: "Découvrir",     href: "/search",        icon: Compass  },
  { label: "Publier",       href: "/post/new",      icon: Plus     },
  { label: "Notifications", href: "/notifications", icon: Bell     },
  { label: "Profil",        href: "/profile",       icon: User     },
];

// ── Items Sidebar (Desktop / Tablette) ──────────────────────
// Sur desktop/tablette, la publication se fait directement en tête du feed
export const SIDEBAR_ITEMS: NavItem[] = [
  { label: "Accueil",     href: "/feed",    icon: Home     },
  { label: "Découvrir",   href: "/search",  icon: Compass  },
  { label: "Jeux & Quiz", href: "/game",    icon: Gamepad2, badge: true },
  { label: "Profil",      href: "/profile", icon: User     },
];

// ── Items droite TopBar ────────────────────────────────────
export const TOPBAR_RIGHT: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell, badge: true },
  { label: "Mon compte",    href: "/settings",      icon: DynamicProfileIcon },
];