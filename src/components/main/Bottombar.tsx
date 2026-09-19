"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./navConstants";

const MotionLink = motion.create(Link);

/**
 * Barre de navigation inférieure (BottomBar) pour Mobile.
 * S'affiche en bas de l'écran avec les icônes de navigation.
 * Harmonisé avec le design system (Tailwind sémantique, couleur d'accent #FF3E00).
 *
 * @component
 * @returns {JSX.Element} La BottomBar mobile.
 */
export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border/80 bg-background/95 px-2 backdrop-blur-xl transition-colors duration-300"
      aria-label="Navigation principale"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/feed" && pathname.startsWith(item.href));
        const isPublish = item.href === "/post/new";

        // Bouton central (+) surélevé avec couleur primaire et lueur dynamique
        if (isPublish) {
          return (
            <MotionLink
              key={item.href}
              href={item.href}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              aria-label={item.label}
              className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_4px_20px_var(--primary)] transition-all no-underline"
            >
              <Icon size={24} strokeWidth={2.5} />
            </MotionLink>
          );
        }

        return (
          <MotionLink
            key={item.href}
            href={item.href}
            whileTap={{ scale: 0.85 }}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1 transition-colors no-underline ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              {isActive && (
                <motion.div
                  layoutId="bottombar-glow"
                  className="absolute -bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                />
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 ${isActive ? "font-semibold text-white" : "font-medium text-muted-foreground"}`}
            >
              {item.label}
            </span>
          </MotionLink>
        );
      })}
    </nav>
  );
}
