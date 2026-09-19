"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X, Bell, User, Globe, Settings, Shield } from "lucide-react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import Image from "next/image";
import logo from "@/assets/logo.png";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

// Style commun aux boutons d'action de la barre.
const ACTION_BTN =
  "flex cursor-pointer items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50";

/**
 * Menu déroulant administrateur permettant de basculer
 * vers l'Espace Utilisateur, d'accéder au profil/paramètres et de se déconnecter.
 */
function AdminProfileDropdown() {
  const { user, isInitializing, logout } = useAuth();
  const { profile } = useProfile(user?.uid);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isInitializing || !user) return null;

  const name = user.displayName || user.email || "Admin";
  const initials = name.slice(0, 2).toUpperCase();
  const avatarSrc = profile?.photoURL || user.photoURL;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Menu administrateur"
        className="cursor-pointer block rounded-full focus:outline-none ring-2 ring-transparent hover:ring-amber-500/50 transition-all"
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={name}
            width={34}
            height={34}
            priority
            className="size-8 rounded-full object-cover border border-amber-500/50 shadow-sm shadow-amber-500/20"
            unoptimized
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-black shadow-md shadow-amber-500/25">
            {initials}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 rounded-2xl border border-border/90 bg-[#0e1338]/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-foreground"
          >
            {/* En-tête profil administrateur */}
            <div className="px-3 py-2 border-b border-border/60 mb-2">
              <div className="flex items-center justify-between gap-1.5">
                <p className="text-xs font-bold text-white truncate">{name}</p>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded-md">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>

            {/* Passerelle directe vers l'Espace Utilisateur */}
            <Link
              href="/feed"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-primary hover:text-white hover:bg-primary/20 rounded-xl transition-all no-underline border border-primary/30 mb-1.5 shadow-sm bg-primary/10"
            >
              <Globe size={15} className="text-primary" />
              <span>Espace Utilisateur</span>
            </Link>

            {/* Lien Mon profil */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/80 rounded-xl transition-colors no-underline"
            >
              <User size={15} className="text-amber-400" />
              <span>Mon Profil</span>
            </Link>

            {/* Lien Paramètres */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/80 rounded-xl transition-colors no-underline"
            >
              <Settings size={15} className="text-amber-400" />
              <span>Paramètres</span>
            </Link>

            <div className="h-px bg-border/60 my-1.5" />

            {/* Déconnexion */}
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>Se déconnecter</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminHeader({ onMenuToggle, isMenuOpen }: AdminHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-surface/95 px-6 backdrop-blur-xl">
      {/* ── Logo ── */}
      <Link href="/admin/content" className="flex items-center gap-2">
        <Image
          src={logo}
          alt="Otaku 225 — Administration"
          width={100}
          height={42}
          priority
          style={{ width: "auto", height: "auto", maxWidth: 120 }}
        />
      </Link>

      {/* ── Titre (mobile/tablette uniquement) ── */}
      <h1 className="mx-auto text-sm font-bold text-foreground md:hidden">
        Cockpit Admin
      </h1>

      <div className="flex-1" />

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
          className={`relative ${ACTION_BTN}`}
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
        </motion.button>

        {/* Menu déroulant profil Administrateur */}
        <AdminProfileDropdown />

        {/* Menu (mobile uniquement) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          className={`ml-1 md:hidden ${ACTION_BTN}`}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>
    </header>
  );
}
