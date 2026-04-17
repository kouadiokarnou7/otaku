"use client";

import Link from "next/link";
import { Bell, Swords } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import Image from "next/image";

interface MobileHeaderProps {
  notifCount?: number;
}

export default function MobileHeader({ notifCount = 0 }: MobileHeaderProps) {
  return (
    <header
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         50,
        height:         56,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "0 16px",
        background:     "rgba(5,5,8,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom:   "1px solid rgba(255,255,255,0.06)",
      }}
      /* Visible uniquement sur mobile */
      className="md:hidden"
    >
      {/* Logo */}
      <Link
        href="/feed"
        style={{ display:"flex", alignItems:"center", gap:7, textDecoration:"none" }}
      >
        <Image src={logo} alt="Logo" width={22} height={22} style={{ width: 'auto', height: 'auto' }} />
        
      </Link>

      {/* Cloche notifications */}
      <Link href="/notifications" style={{ position:"relative", textDecoration:"none" }}>
        <motion.div
          whileTap={{ scale: 0.85 }}
          style={{
            width:          40,
            height:         40,
            borderRadius:   12,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "rgba(255,255,255,0.04)",
            border:         "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Bell size={19} color="rgba(255,255,255,0.7)" />
        </motion.div>

        {/* Badge */}
        {notifCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position:       "absolute",
              top:            -4,
              right:          -4,
              minWidth:       18,
              height:         18,
              borderRadius:   99,
              background:     "#FF6B1A",
              color:          "#fff",
              fontSize:       10,
              fontWeight:     700,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "0 4px",
              border:         "2px solid #050508",
            }}
          >
            {notifCount > 9 ? "9+" : notifCount}
          </motion.span>
        )}
      </Link>
    </header>
  );
}