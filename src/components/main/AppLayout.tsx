"use client";

import { ReactNode } from "react";
import MobileHeader from "./Mobileheader";
import BottomBar    from "./Bottombar";
import TopBar       from "./topbar";
import Sidebar      from "./sidebar";

interface AppLayoutProps {
  children:    ReactNode;
  notifCount?: number;
}

export default function AppLayout({ children, notifCount = 0 }: AppLayoutProps) {
  return (
    <div style={{ minHeight:"100vh", background:"#050508" }}>

      {/* ── Mobile uniquement : header haut (caché md+) ── */}
      <div className="block md:hidden">
        <MobileHeader notifCount={notifCount} />
      </div>

      {/* ── md+ uniquement : top bar ── */}
      <div className="hidden md:block">
        <TopBar notifCount={notifCount} />
      </div>

      {/* ── lg uniquement : sidebar complète 240px ── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── md→lg uniquement : sidebar icônes 72px ── */}
      <div className="hidden md:block lg:hidden">
        <Sidebar iconOnly />
      </div>

      {/* ── Contenu principal ──
          mobile    : top=56px (mobileheader) + bottom=64px (bottombar)
          tablette  : top=60px + left=72px
          desktop   : top=60px + left=240px
      ── */}
      <main
        className="pt-[56px] pb-[64px] md:pt-[60px] md:pb-0 md:pl-[72px] lg:pl-[240px]"
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