// src/components/admin/adminNavConstants.ts
import { LayoutDashboard, Users, Settings, BarChart3, FileText, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { label: "Utilisateurs", href: "/admin/users",       icon: Users },
  { label: "Contenu",      href: "/admin/content",     icon: FileText },
  { label: "Modération",   href: "/admin/moderation",  icon: Shield },
  { label: "Statistiques", href: "/admin/analytics",   icon: BarChart3 },
  { label: "Paramètres",   href: "/admin/settings",    icon: Settings },
];
