import { Home, Search, PlusSquare, User, Gamepad2, Bell } from "lucide-react";

export interface NavItem {
  label:  string;
  href:   string;
  icon:   typeof Home;
  badge?: boolean; // true = peut afficher un badge (notifs)
}

// ── 4 sections principales + bouton créer ───────────────────
export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil",         href: "/feed",          icon: Home      },
  { label: "Anime",        href: "/search",         icon: Search    },
  { label: "Publier",      href: "/post/new",       icon: PlusSquare},
  { label: "Jeux",         href: "/game",           icon: Gamepad2  },
  { label: "Profil",       href: "/profile",        icon: User      },
  
];

// ── Items droite TopBar (desktop) ────────────────────────────
export const TOPBAR_RIGHT: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell,  badge: true },
  { label: "Profil",        href: "/profile",        icon: User             },
];

export const PUBLISH_ITEM: NavItem = {
  label: "Publier",
  href:  "/post/new",
  icon:  PlusSquare,
};