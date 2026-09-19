"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

interface MobileHeaderProps {
  notifCount?: number;
  onMenuToggle?: () => void;
}

export default function MobileHeader({ notifCount = 0 }: MobileHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl md:hidden transition-colors duration-300">
      {/* ── Logo Nekama ── */}
      <Link href="/feed" className="flex flex-col no-underline group">
        <span className="font-heading text-lg font-extrabold tracking-tight text-white group-hover:text-primary transition-colors">
          Nekama
        </span>
        <span className="text-[9px] -mt-1 font-medium tracking-widest text-primary/80">
          ネカマ
        </span>
      </Link>

      {/* ── Actions droite : Recherche générale + Notifications ── */}
      <div className="flex items-center gap-2">
        <Link
          href="/search"
          aria-label="Recherche générale"
          className="relative no-underline"
        >
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted hover:border-primary/40 transition-colors"
          >
            <Search size={17} />
          </motion.div>
        </Link>

        <Link
          href="/notifications"
          aria-label={
            notifCount > 0 ? `Notifications (${notifCount} non lues)` : "Notifications"
          }
          className="relative no-underline"
        >
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-muted-foreground hover:text-white hover:bg-muted hover:border-primary/40 transition-colors"
          >
            <Bell size={18} />
          </motion.div>

          {notifCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border-2 border-[#0a0e27] bg-[#EF4444] px-1 text-[9px] font-bold text-white shadow-sm"
            >
              {notifCount > 9 ? "9+" : notifCount}
            </motion.span>
          )}
        </Link>
      </div>
    </header>
  );
}
