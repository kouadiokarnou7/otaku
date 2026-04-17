"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./navConstants";

const MotionLink = motion.create(Link);

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:50, height:64,
      display:"flex", alignItems:"center", justifyContent:"space-around",
      background:"rgba(5,5,8,0.95)", backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.06)",
      paddingBottom:"env(safe-area-inset-bottom)",
    }}>
      {NAV_ITEMS.map((item) => {
        const Icon      = item.icon;
        const isActive  = pathname === item.href;
        const isPublish = item.href === "/post/new";

        if (isPublish) {
          return (
            <MotionLink
              key={item.href}
              href={item.href}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              style={{
                textDecoration:"none",
                width:52, height:52, borderRadius:16,
                background:"linear-gradient(135deg,#FF6B1A,#C0392B)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 20px rgba(255,107,26,0.4)",
                marginBottom:8,
              }}
            >
              <Icon size={22} color="#fff" />
            </MotionLink>
          );
        }

        return (
          <MotionLink
            key={item.href}
            href={item.href}
            whileTap={{ scale: 0.85 }}
            style={{
              textDecoration:"none", flex:1,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              gap:3, padding:"4px 8px", borderRadius:10,
            }}
          >
            <div style={{ position:"relative" }}>
              <Icon
                size={22}
                color={isActive ? "#FF6B1A" : "rgba(255,255,255,0.4)"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {isActive && (
                <motion.div
                  layoutId={`bottombar-dot-${item.href}`}
                  style={{
                    position:"absolute", bottom:-6, left:"50%",
                    transform:"translateX(-50%)",
                    width:4, height:4, borderRadius:"50%", background:"#FF6B1A",
                  }}
                />
              )}
            </div>
            <span style={{
              fontSize:9, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.3)",
              letterSpacing:"0.04em",
            }}>
              {item.label}
            </span>
          </MotionLink>
        );
      })}
    </nav>
  );
}