"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, User, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./navConstants";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/store/auth/useauth";

const MotionLink = motion(Link);

interface TopBarProps {
  notifCount?: number;
  onToggleSidebar?: () => void;
}

// ── Sous-composant : Boutons Auth directs ─────────────────────────
function AuthButtons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Se connecter - Bouton outline */}
      <MotionLink
        href="/login"
        whileHover={{ scale: 1.02, background: "rgba(255,107,26,0.15)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          textDecoration: "none",
          color: "#FF6B1A",
          fontSize: 13,
          fontWeight: 600,
          border: "1px solid rgba(255,107,26,0.4)",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s"
        }}
      >
        <LogOut size={14} style={{ transform: "rotate(180deg)" }} />
        Se connecter
      </MotionLink>

      {/* S'inscrire - Bouton plein */}
      <MotionLink
        href="/register"
        whileHover={{ scale: 1.02, background: "#FF5700" }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          textDecoration: "none",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          background: "linear-gradient(135deg, #FF6B1A, #FF4500)",
          border: "1px solid transparent",
          display: "flex",
          alignItems: "center",
          gap: 6,
          boxShadow: "0 2px 12px rgba(255,107,26,0.3)",
          transition: "all 0.2s"
        }}
      >
        <User size={14} />
        S'inscrire
      </MotionLink>
    </div>
  );
}

// ── Sous-composant : Avatar Dynamique ─────────────────────────
function ProfileAvatar() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div style={{ 
        width: 32, height: 32, borderRadius: "50%", 
        background: "rgba(255,255,255,0.1)", 
        animation: "pulse 1.5s infinite ease-in-out" 
      }} />
    );
  }

  if (!user) return null;

  const name = user.displayName || user.email || "U";
  const initials = name.slice(0, 2).toUpperCase();

  if (user.photoURL) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{ position: "relative", cursor: "pointer" }}
      >
        <Image
          src={user.photoURL}
          alt="Avatar"
          style={{ borderRadius: "50%", objectFit: "cover" }}
          priority
          width={32}
          height={32}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg, #FF6B1A, #FF4500)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: "#fff",
        boxShadow: "0 2px 8px rgba(255,107,26,0.3)",
        cursor: "pointer"
      }}
      title={name}
    >
      {initials}
    </motion.div>
  );
}

// ── Composant Principal TopBar ──────────────────────────────
export default function TopBar({ notifCount = 0, onToggleSidebar }: TopBarProps) {
  const pathname = usePathname();
  const { user, isInitializing } = useAuth();
  const isAuth = !!user && !isInitializing;

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 60,
      display: "flex", alignItems: "center", padding: "0 24px", gap: 16,
      background: "rgba(5,5,8,0.92)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>

      {/* ── Logo ── */}
      <MotionLink
        href="/feed"
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.97 }}
        style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
      >
        <Image src={logo} alt="Logo" width={100} height={42} priority style={{ width: 'auto', height: 'auto' }} />
      </MotionLink>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Droite (Actions) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>

        {/* 🔹 Si NON connecté → Boutons Auth directs */}
        {!isAuth && <AuthButtons />}

        {/* 🔹 Si connecté → Notifications + Avatar */}
        {isAuth && (
          <>
            <MotionLink
              href="/notifications"
              whileHover={{ background: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "relative", textDecoration: "none",
                width: 40, height: 40, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: pathname === "/notifications" ? "rgba(255,107,26,0.1)" : "transparent",
                border: pathname === "/notifications" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
                transition: "all .2s",
              }}
            >
              <Bell size={19} color={pathname === "/notifications" ? "#FF6B1A" : "rgba(255,255,255,0.55)"} />
              {notifCount > 0 && (
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  minWidth: 16, height: 16, borderRadius: 99,
                  background: "#FF6B1A", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px", border: "2px solid #050508",
                }}>
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </MotionLink>

            <ProfileAvatar />
          </>
        )}

        {/* Séparateur */}
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }} />
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </header>
  );
}