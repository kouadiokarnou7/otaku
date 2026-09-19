"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, Menu, X, Bell, User } from "lucide-react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useState } from "react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

// Style commun aux boutons d'action de la barre.
const ACTION_BTN =
  "flex cursor-pointer items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50";

export default function AdminHeader({ onMenuToggle, isMenuOpen }: AdminHeaderProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-surface/95 px-6 backdrop-blur-xl">
      {/* ── Logo ── */}
      <Link href="/admin" className="flex items-center gap-2">
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
        Admin Panel
      </h1>

      <div className="flex-1" />

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
          className={`relative ${ACTION_BTN}`}
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
        </motion.button>

        {/* Profil */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Mon compte"
          className={ACTION_BTN}
        >
          <User size={20} />
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Se déconnecter"
          className={ACTION_BTN}
        >
          <LogOut size={20} />
        </motion.button>

        {/* Menu (mobile uniquement) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
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
