"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, User, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./navConstants";
import logo from "@/assets/logo.png";
import Image from "next/image";

// motion(Link) — on anime directement le lien
const MotionLink = motion(Link);

interface TopBarProps {
  notifCount?: number;
}

export default function TopBar({ notifCount = 0 }: TopBarProps) {
  const pathname  = usePathname();
  const navItems  = NAV_ITEMS.filter((item) => item.href !== "/post/new");

  const handleLogout = () => {
    // TODO : Firebase Auth signOut()
    console.log("Déconnexion...");
  };

  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:50, height:60,
      display:"flex", alignItems:"center", padding:"0 24px", gap:16,
      background:"rgba(5,5,8,0.92)", backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
    }}>

      {/* ── Logo ── */}
      <MotionLink
        href="/feed"
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.97 }}
        style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}
      >
       <Image src={logo} alt="Logo" width={100} height={42} />
      </MotionLink>

      {/* ── Liens nav centrés ── */}
      <nav style={{ display:"flex", alignItems:"center", gap:4, margin:"0 auto" }}>
        {navItems.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <MotionLink
              key={item.href}
              href={item.href}
              whileHover={{ background:"rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"7px 14px", borderRadius:10,
                textDecoration:"none", transition:"all .2s",
                background: isActive ? "rgba(255,107,26,0.1)"           : "transparent",
                border:     isActive ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
              }}
            >
              <Icon
                size={17}
                color={isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span style={{
                fontSize:13, fontWeight: isActive ? 700 : 500,
                color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)",
              }}>
                {item.label}
              </span>
            </MotionLink>
          );
        })}
      </nav>

      {/* ── Droite ── */}
      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>

        {/* Notifs */}
        <MotionLink
          href="/notifications"
          whileHover={{ background:"rgba(255,255,255,0.07)" }}
          whileTap={{ scale: 0.9 }}
          style={{
            position:"relative", textDecoration:"none",
            width:40, height:40, borderRadius:10,
            display:"flex", alignItems:"center", justifyContent:"center",
            background: pathname==="/notifications" ? "rgba(255,107,26,0.1)" : "transparent",
            border:     pathname==="/notifications" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
            transition:"all .2s",
          }}
        >
          <Bell size={19} color={pathname==="/notifications" ? "#FF6B1A" : "rgba(255,255,255,0.55)"} />
          {notifCount > 0 && (
            <span style={{
              position:"absolute", top:-3, right:-3,
              minWidth:16, height:16, borderRadius:99,
              background:"#FF6B1A", color:"#fff",
              fontSize:9, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"0 3px", border:"2px solid #050508",
            }}>
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </MotionLink>

        {/* Profil */}
        <MotionLink
          href="/profile"
          whileHover={{ background:"rgba(255,255,255,0.07)" }}
          whileTap={{ scale: 0.9 }}
          style={{
            textDecoration:"none",
            width:40, height:40, borderRadius:10,
            display:"flex", alignItems:"center", justifyContent:"center",
            background: pathname==="/profile" ? "rgba(255,107,26,0.1)" : "transparent",
            border:     pathname==="/profile" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
            transition:"all .2s",
          }}
        >
          <User size={19} color={pathname==="/profile" ? "#FF6B1A" : "rgba(255,255,255,0.55)"} />
        </MotionLink>

        {/* Séparateur */}
        <div style={{ width:1, height:24, background:"rgba(255,255,255,0.08)" }} />

        {/* Déconnexion */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ background:"rgba(220,60,60,0.12)", borderColor:"rgba(220,60,60,0.35)", color:"#e05252" }}
          whileTap={{ scale: 0.95 }}
          style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"7px 14px", borderRadius:10,
            border:"1px solid rgba(255,255,255,0.08)",
            background:"transparent", color:"rgba(255,255,255,0.4)",
            fontSize:13, fontWeight:600, cursor:"pointer",
            transition:"all .2s", whiteSpace:"nowrap",
          }}
        >
          <LogOut size={15} />
          Déconnexion
        </motion.button>
      </div>
    </header>
  );
}