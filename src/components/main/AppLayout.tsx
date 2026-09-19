"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileHeader from "./Mobileheader";
import BottomBar from "./Bottombar";
import TopBar from "./topbar";
import Sidebar from "./sidebar";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useNotifications } from "@/lib/hooks/store/useNotifications";

interface AppLayoutProps {
  children: ReactNode;
  notifCount?: number;
}

export default function AppLayout({ children, notifCount }: AppLayoutProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.uid);
  const effectiveNotifCount = notifCount !== undefined ? notifCount : unreadCount;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // La sidebar est `fixed` : elle ne pousse pas le contenu toute seule.
  // Le décalage est fait en CSS pur (préfixe `md:`) et NON en JS :
  // `isMobile` n'est connu qu'après le premier effet, donc un calcul en
  // JS appliquait une marge de 240px au premier rendu sur mobile —
  // d'où le débordement horizontal au chargement.
  const sidebarOffset = isExpanded ? "md:ml-60" : "md:ml-[72px]";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Mobile uniquement : header logo + cloche ── */}
      <div className="block md:hidden">
        <MobileHeader notifCount={effectiveNotifCount} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      {/* ── Desktop + Tablette : top bar complète ── */}
      <div className="hidden md:block">
        <TopBar notifCount={effectiveNotifCount} onToggleSidebar={() => setIsExpanded(!isExpanded)} />
      </div>

      <div className="flex min-h-[calc(100vh-56px)] flex-1 md:min-h-[calc(100vh-60px)]">
        {/* ── Sidebar (desktop + tablette seulement) ── */}
        <div className="hidden md:block">
          <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </div>

        {/* ── Animations Mobile ── */}
        <AnimatePresence>
          {/* ── Overlay sur mobile ── */}
          {isMobile && isMenuOpen && (
            <motion.button
              key="overlay"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
              className="fixed inset-0 z-30 bg-black/50"
            />
          )}

          {/* ── Mobile sidebar (slide-in) ── */}
          {isMobile && isMenuOpen && (
            <motion.div
              key="drawer"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-16 left-0 top-14 z-40 w-60"
            >
              <Sidebar isExpanded onToggle={() => setIsMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Contenu principal ── */}
        {/* Le layout ne gère QUE les décalages (barres fixes + sidebar).
            Il n'impose ni largeur ni padding horizontal : chaque page pose
            son propre conteneur. Sinon les deux s'empilent — la page se
            retrouve doublement rognée — et les en-têtes sticky ne peuvent
            plus aller pleine largeur.
            `min-w-0` empêche un enfant large (image, tableau) de forcer un
            débordement horizontal de la grille flex. */}
        <main
          className={`min-w-0 flex-1 pb-20 pt-14 transition-[margin] duration-300 md:pb-8 md:pt-[60px] ${sidebarOffset}`}
        >
          {children}
        </main>
      </div>

      {/* ── Mobile uniquement : bottom bar ── */}
      <div className="block md:hidden">
        <BottomBar />
      </div>
    </div>
  );
}
