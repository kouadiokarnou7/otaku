"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ADMIN_NAV_ITEMS } from "./adminNavConstants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface AdminSidebarProps {
  /** Drawer mobile ouvert. */
  isOpen?: boolean;
  /** Appelé quand l'utilisateur tape l'overlay sur mobile. */
  onClose?: () => void;
  /** Sidebar déployée (240px) ou réduite aux icônes (72px), sur desktop. */
  isExpanded?: boolean;
  /** Bascule déployée/réduite. L'état vit dans le layout, qui doit
      décaler <main> de la même largeur. */
  onToggleExpand?: () => void;
}

export default function AdminSidebar({
  isOpen = true,
  onClose,
  isExpanded = true,
  onToggleExpand,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran (pour le mode drawer uniquement).
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const width = isMobile ? (isOpen ? 240 : 0) : isExpanded ? 240 : 72;
  // En drawer mobile, on affiche toujours les libellés : il n'y a
  // aucune raison de réduire aux icônes une sidebar qui recouvre l'écran.
  const showLabels = isExpanded || isMobile;

  return (
    <>
      {/* Overlay sur mobile quand la sidebar est ouverte */}
      {isMobile && isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ duration: 0.3 }}
        style={{ top: 64 }}
        className={[
          "fixed bottom-0 left-0 z-40 flex flex-col gap-1",
          "border-r border-border bg-surface/95 backdrop-blur-xl",
          showLabels ? "items-stretch overflow-y-auto p-3" : "items-center overflow-hidden py-3",
        ].join(" ")}
      >
        {/* Toggle (desktop / tablette uniquement) */}
        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleExpand}
            title={isExpanded ? "Réduire" : "Agrandir"}
            aria-label={isExpanded ? "Réduire le menu" : "Agrandir le menu"}
            aria-expanded={isExpanded}
            className="mb-2 flex cursor-pointer items-center justify-center rounded-lg border border-border bg-foreground/5 px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </motion.button>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1" aria-label="Navigation administration">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!showLabels ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center rounded-xl border transition-colors",
                  showLabels
                    ? "w-full justify-start gap-3 px-3.5 py-2.5"
                    : "size-[46px] justify-center",
                  isActive
                    ? "border-brand-border bg-brand-dim text-brand"
                    : "border-transparent text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  size={showLabels ? 19 : 20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="shrink-0"
                />

                {showLabels && (
                  <>
                    <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
