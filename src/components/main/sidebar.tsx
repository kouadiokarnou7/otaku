"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./navConstants";

interface SidebarProps {
  iconOnly?: boolean;
}

export default function Sidebar({ iconOnly = false }: SidebarProps) {
  const pathname = usePathname();
  const width    = iconOnly ? 72 : 240;

  return (
    <aside style={{
      position:      "fixed",
      top:           60,
      left:          0,
      bottom:        0,
      width:         width,
      background:    "#050508",
      borderRight:   "1px solid rgba(255,255,255,0.06)",
      display:       "flex",
      flexDirection: "column",
      padding:       iconOnly ? "12px 0" : "16px 12px",
      alignItems:    iconOnly ? "center" : "stretch",
      gap:           4,
      zIndex:        40,
      overflowY:     "auto",
    }}>
      {NAV_ITEMS.map((item) => {
        const Icon      = item.icon;
        const isActive  = pathname === item.href;
        const isPublish = item.href === "/post/new";

        if (isPublish) {
          return (
            <Link key={item.href} href={item.href}
              style={{ textDecoration:"none", margin: iconOnly ? "6px 0" : "8px 0 4px" }}
            >
              <motion.div
                whileHover={{ y:-1, boxShadow:"0 6px 20px rgba(255,107,26,0.3)" }}
                whileTap={{ scale:0.97 }}
                style={{
                  display:"flex", alignItems:"center",
                  justifyContent: iconOnly ? "center" : "flex-start",
                  gap:            iconOnly ? 0 : 10,
                  padding:        iconOnly ? "0" : "11px 14px",
                  width:          iconOnly ? 46 : "auto",
                  height:         iconOnly ? 46 : "auto",
                  borderRadius:   iconOnly ? 14 : 12,
                  background:     "linear-gradient(135deg,#FF6B1A,#C0392B)",
                  color:          "#fff",
                  fontSize:       14,
                  fontWeight:     700,
                  boxShadow:      iconOnly ? "0 0 16px rgba(255,107,26,0.35)" : "none",
                }}
              >
                <Icon size={iconOnly ? 20 : 18} />
                {!iconOnly && item.label}
              </motion.div>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} style={{ textDecoration:"none" }}>
            <motion.div
              whileHover={{ background:"rgba(255,255,255,0.05)" }}
              whileTap={{ scale:0.97 }}
              title={iconOnly ? item.label : undefined}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: iconOnly ? "center" : "flex-start",
                gap:            iconOnly ? 0 : 12,
                padding:        iconOnly ? "0" : "11px 14px",
                width:          iconOnly ? 46 : "auto",
                height:         iconOnly ? 46 : "auto",
                borderRadius:   12,
                background:     isActive ? "rgba(255,107,26,0.1)"  : "transparent",
                border:         isActive ? "1px solid rgba(255,107,26,0.2)" : "1px solid transparent",
                transition:     "all .2s",
              }}
            >
              <Icon
                size={iconOnly ? 20 : 19}
                color={isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)"}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {!iconOnly && (
                <span style={{
                  fontSize:14, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.55)",
                }}>
                  {item.label}
                </span>
              )}
              {!iconOnly && isActive && (
                <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:"50%", background:"#FF6B1A" }} />
              )}
            </motion.div>
          </Link>
        );
      })}
    </aside>
  );
}