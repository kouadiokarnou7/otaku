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

export default function AdminHeader({ onMenuToggle, isMenuOpen }: AdminHeaderProps) {
  const { logout, user } = useAuth();
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
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        background: "rgba(5,5,8,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Logo ── */}
      <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={42}
          priority
          style={{ width: "auto", height: "auto", maxWidth: 120 }}
        />
      </Link>

      {/* ── Titre (visible sur mobile/tablette seulement) ── */}
      <div className="md:hidden ml-auto mr-auto">
        <h1 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Admin Panel</h1>
      </div>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Actions droite ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Bell size={20} color="rgba(255,255,255,0.6)" />
          <div
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 8,
              height: 8,
              background: "#FF6B1A",
              borderRadius: "50%",
            }}
          />
        </motion.button>

        {/* Profil */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={20} color="rgba(255,255,255,0.6)" />
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isLoggingOut ? 0.5 : 1,
          }}
        >
          <LogOut size={20} color="rgba(255,255,255,0.6)" />
        </motion.button>

        {/* Menu Toggle (visible sur mobile seulement) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="md:hidden"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          {isMenuOpen ? (
            <X size={20} color="rgba(255,255,255,0.8)" />
          ) : (
            <Menu size={20} color="rgba(255,255,255,0.6)" />
          )}
        </motion.button>
      </div>
    </header>
  );
}
