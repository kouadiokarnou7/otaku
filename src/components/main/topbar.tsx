"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, User, PlusSquare } from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";

interface TopBarProps {
  notifCount?: number;
}

export default function TopBar({ notifCount = 0 }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         50,
        height:         60,
        display:        "flex",
        alignItems:     "center",
        padding:        "0 24px",
        gap:            16,
        background:     "rgba(5,5,8,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom:   "1px solid rgba(255,255,255,0.06)",
      }}
      /* Visible uniquement md+ */
      className="hidden md:flex"
    >
      {/* ── Logo ── */}
      <Link
        href="/feed"
        style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}
      >
        <Image src={logo} alt="Logo" width={100} height={40} />
      </Link>

     

      {/* ── Droite : Notifs + Profil + Publier ── */}
      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>

        {/* Notifications */}
        <Link href="/notifications" style={{ position:"relative", textDecoration:"none" }}>
          <motion.div
            whileHover={{ background:"rgba(255,255,255,0.07)" }}
            whileTap={{ scale:0.9 }}
            style={{
              width:40, height:40, borderRadius:10,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: pathname === "/notifications" ? "rgba(255,107,26,0.1)" : "transparent",
              border:     pathname === "/notifications" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
              transition: "all .2s",
            }}
          >
            <Bell
              size={20}
              color={pathname === "/notifications" ? "#FF6B1A" : "rgba(255,255,255,0.55)"}
            />
          </motion.div>
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
        </Link>

        {/* Profil */}
        <Link href="/profile" style={{ textDecoration:"none" }}>
          <motion.div
            whileHover={{ background:"rgba(255,255,255,0.07)" }}
            whileTap={{ scale:0.9 }}
            style={{
              width:40, height:40, borderRadius:10,
              display:"flex", alignItems:"center", justifyContent:"center",
              background: pathname === "/profile" ? "rgba(255,107,26,0.1)" : "transparent",
              border:     pathname === "/profile" ? "1px solid rgba(255,107,26,0.25)" : "1px solid transparent",
              transition: "all .2s",
            }}
          >
            <User
              size={20}
              color={pathname === "/profile" ? "#FF6B1A" : "rgba(255,255,255,0.55)"}
            />
          </motion.div>
        </Link>

        {/* Bouton Publier */}
        <Link href="/post/new" style={{ textDecoration:"none" }}>
          <motion.div
            whileHover={{ y:-1, boxShadow:"0 6px 20px rgba(255,107,26,0.35)" }}
            whileTap={{ scale:0.95 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            6,
              padding:        "8px 16px",
              borderRadius:   10,
              background:     "linear-gradient(135deg,#FF6B1A,#C0392B)",
              color:          "#fff",
              fontSize:       13,
              fontWeight:     700,
              cursor:         "pointer",
              whiteSpace:     "nowrap",
            }}
          >
            <PlusSquare size={15} />
            Publier
          </motion.div>
        </Link>
      </div>
    </header>
  );
}