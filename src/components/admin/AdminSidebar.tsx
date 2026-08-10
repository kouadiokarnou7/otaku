"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_NAV_ITEMS } from "./adminNavConstants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface AdminSidebarProps {
  isOpen?: boolean;
}

export default function AdminSidebar({ isOpen = true }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Sur mobile, garder la sidebar fermée par défaut
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Déterminer la largeur
  const getWidth = () => {
    if (isMobile) return isOpen ? 240 : 0; // Mobile: slide in/out
    return isExpanded ? 240 : 72; // Desktop/Tablette: collapse
  };

  const width = getWidth();

  return (
    <>
      {/* Overlay sur mobile quand la sidebar est ouverte */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => {
            // L'overlay ne ferme pas automatiquement, mais peut être implémenté selon les besoins
          }}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: isMobile ? -240 : 0 }}
          animate={{ x: 0, width }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: 64, // Hauteur du header
            left: 0,
            bottom: 0,
            background: "rgba(5,5,8,0.95)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            padding: isExpanded || isMobile ? "16px 12px" : "12px 0",
            alignItems: isExpanded || isMobile ? "stretch" : "center",
            gap: 4,
            zIndex: 40,
            overflowY: "auto",
            overflow: !isExpanded && !isMobile ? "hidden" : "auto",
          }}
        >
          {/* Toggle Button (Desktop/Tablette uniquement) */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginBottom: 8,
                color: "rgba(255,255,255,0.6)",
              }}
              title={isExpanded ? "Réduire" : "Agrandir"}
            >
              {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </motion.button>
          )}

          {/* Navigation Items */}
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none", display: "flex" }}
              >
                <motion.div
                  whileHover={{
                    background: !isActive ? "rgba(255,255,255,0.08)" : undefined,
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={!isExpanded && !isMobile ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isExpanded || isMobile ? "flex-start" : "center",
                    gap: isExpanded || isMobile ? 12 : 0,
                    padding: isExpanded || isMobile ? "11px 14px" : "0",
                    width: isExpanded || isMobile ? "100%" : 46,
                    height: isExpanded || isMobile ? "auto" : 46,
                    borderRadius: 12,
                    background: isActive ? "rgba(255,107,26,0.15)" : "transparent",
                    border: isActive ? "1px solid rgba(255,107,26,0.3)" : "1px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <Icon
                    size={isExpanded || isMobile ? 19 : 20}
                    color={isActive ? "#FF6B1A" : "rgba(255,255,255,0.5)"}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />

                  {/* Label (visible seulement si expanded ou mobile) */}
                  {(isExpanded || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#FF6B1A" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Badge */}
                  {item.badge && (
                    <motion.div
                      style={{
                        marginLeft: "auto",
                        background: "#FF6B1A",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {item.badge}
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
