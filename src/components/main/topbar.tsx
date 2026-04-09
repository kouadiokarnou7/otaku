"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, User, LogOut, Loader2 } from "lucide-react";
import { NAV_ITEMS } from "./navConstants";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useAuth } from "@/lib/store/auth/useauth"; 

// motion(Link) — on anime directement le lien
const MotionLink = motion(Link);

interface TopBarProps {
  notifCount?: number;
}

// ── Sous-composant : Avatar Dynamique ─────────────────────────
function ProfileAvatar() {
  const { user, isInitializing  } = useAuth();

  // 1. État de chargement (Firebase vérifie la session)
  if (isInitializing) {
    return (
      <div style={{ 
        width: 32, height: 32, borderRadius: "50%", 
        background: "rgba(255,255,255,0.1)", 
        animation: "pulse 1.5s infinite ease-in-out" 
      }} />
    );
  }

  // 2. Utilisateur non connecté → Icône par défaut
  if (!user) {
    return <User size={19} color="rgba(255,255,255,0.55)" />;
  }

  // 3. Utilisateur connecté : Calcul des initiales
  const name = user.displayName || user.email || "U";
  const initials = name.slice(0, 2).toUpperCase();

  // 4. Affichage : Photo (Google) ou Initiales (Email)
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="Avatar"
        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }

  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: "linear-gradient(135deg, #FF6B1A, #FF4500)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color: "#fff",
      boxShadow: "0 2px 8px rgba(255,107,26,0.3)"
    }}>
      {initials}
    </div>
  );
}

// ── Composant Principal TopBar ──────────────────────────────
export default function TopBar({ notifCount = 0 }: TopBarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS.filter((item) => item.href !== "/post/new");
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

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
        <Image src={logo} alt="Logo" width={100} height={42} priority />
      </MotionLink>

      {/* ── Liens nav centrés ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <MotionLink
              key={item.href}
              href={item.href}
              whileHover={{ background: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 10,
                textDecoration: "none", transition: "all .2s",
                background: isActive ? "rgba(255,107,26,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
              }}
            >
              <Icon
                size={17}
                color={isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span style={{
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)",
              }}>
                {item.label}
              </span>
            </MotionLink>
          );
        })}
      </nav>

      {/* ── Droite (Actions) ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

        {/* Notifs */}
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

        {/* 🔹 PROFIL DYNAMIQUE (Remplace l'icône User statique) */}
        <MotionLink
          href="/profile"
          whileHover={{ background: "rgba(255,255,255,0.07)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            textDecoration: "none",
            width: 40, height: 40, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: pathname === "/profile" ? "rgba(255,107,26,0.1)" : "transparent",
            border: pathname === "/profile" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
            transition: "all .2s",
          }}
        >
          <ProfileAvatar />
        </MotionLink>

        {/* Séparateur */}
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.08)" }} />

        {/* Déconnexion */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ background: "rgba(220,60,60,0.12)", borderColor: "rgba(220,60,60,0.35)", color: "#e05252" }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent", color: "rgba(255,255,255,0.4)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all .2s", whiteSpace: "nowrap",
          }}
        >
          <LogOut size={15} />
          Déconnexion
        </motion.button>
      </div>
      
      {/* Keyframes pour l'animation de chargement */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </header>
  );
}