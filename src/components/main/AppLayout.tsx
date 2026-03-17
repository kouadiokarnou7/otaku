"use client";

import { ReactNode } from "react";
import MobileHeader from "./Mobileheader";
import BottomBar    from "./Bottombar";
import TopBar       from "./topbar";

interface AppLayoutProps {
  children:    ReactNode;
  notifCount?: number;
}

export default function AppLayout({ children, notifCount = 0 }: AppLayoutProps) {
  return (
    <div style={{ minHeight:"100vh", background:"#050508" }}>

      {/* ── Mobile uniquement : header logo + cloche ── */}
      <div className="block md:hidden">
        <MobileHeader notifCount={notifCount} />
      </div>

      {/* ── Desktop + Tablette : top bar complète ── */}
      <div className="hidden md:block">
        <TopBar notifCount={notifCount} />
      </div>

      {/* ── Contenu principal ──
          Mobile    : pt=56px (mobileheader) + pb=64px (bottombar)
          md+       : pt=60px (topbar) — pas de sidebar
      ── */}
      <main
        className="pt-[56px] pb-[64px] md:pt-[60px] md:pb-0"
        style={{ color:"#fff" }}
      >
        <div style={{ maxWidth:680, margin:"0 auto", padding:"24px 16px" }}>
          {children}
        </div>
      </main>

      {/* ── Mobile uniquement : bottom bar ── */}
      <div className="block md:hidden">
        <BottomBar />
      </div>

    </div>
  );
}