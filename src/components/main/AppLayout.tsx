"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileHeader from "./Mobileheader";
import BottomBar from "./Bottombar";
import TopBar from "./topbar";
import Sidebar from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
  notifCount?: number;
}

export default function AppLayout({ children, notifCount = 0 }: AppLayoutProps) {
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

  return (
    <div style={{ minHeight: "100vh", background: "#050508" }}>
      {/* ── Mobile uniquement : header logo + cloche ── */}
      <div className="block md:hidden">
        <MobileHeader notifCount={notifCount} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      {/* ── Desktop + Tablette : top bar complète ── */}
      <div className="hidden md:block">
        <TopBar notifCount={notifCount} onToggleSidebar={() => setIsExpanded(!isExpanded)} />
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 56px)" }} className="md:min-h-[calc(100vh-60px)]">
        {/* ── Sidebar (desktop + tablette seulement) ── */}
        <div className="hidden md:block">
          <Sidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </div>

        {/* ── Animations Mobile ── */}
        <AnimatePresence>
          {/* ── Overlay sur mobile ── */}
          {isMobile && isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 30,
              }}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* ── Mobile sidebar (slide-in) ── */}
          {isMobile && isMenuOpen && (
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 56,
                left: 0,
                width: 240,
                bottom: 64,
                zIndex: 40,
              }}
            >
              <Sidebar isExpanded={true} onToggle={() => setIsMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Contenu principal ── */}
        <main
          className="pt-[56px] pb-[64px] md:pt-[60px] md:pb-0 flex-1"
          style={{ color: "#dacfcf", overflowY: "auto" }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile uniquement : bottom bar ── */}
      <div className="block md:hidden">
        <BottomBar />
      </div>
    </div>
  );
}