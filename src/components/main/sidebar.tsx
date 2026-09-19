"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareHeart } from "lucide-react";
import { SIDEBAR_ITEMS } from "./navConstants";
import BetaFeedbackModal from "./BetaFeedbackModal";

interface SidebarProps {
  iconOnly?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * Sidebar latérale pour la navigation principale (Desktop & Tablette).
 * Harmonisé avec le design system Nekama (#0a0e27, #8B5CF6).
 */
export default function Sidebar({ iconOnly: iconOnlyProp, isExpanded = true }: SidebarProps) {
  const pathname = usePathname();
  const iconOnly = iconOnlyProp ?? !isExpanded;
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <aside
        style={{ top: 60, width: iconOnly ? 72 : 240 }}
        className={`fixed bottom-0 left-0 z-40 flex flex-col justify-between overflow-y-auto border-r border-border/80 bg-[#0a0e27]/95 backdrop-blur-xl transition-all duration-300 ${
          iconOnly ? "items-center py-3" : "items-stretch p-3"
        }`}
      >
        {/* ── Navigation Principale ── */}
        <div className="flex flex-col gap-1 w-full">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/feed" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={iconOnly ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center rounded-2xl border transition-all no-underline ${
                  iconOnly ? "size-[44px] justify-center" : "justify-start gap-3 px-3.5 py-2.5"
                } ${
                  isActive
                    ? "border-primary/40 bg-primary/10 text-white font-bold"
                    : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-white"
                }`}
              >
                <Icon
                  size={iconOnly ? 20 : 19}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={`shrink-0 ${isActive ? "text-primary" : ""}`}
                />
                {!iconOnly && (
                  <span className="text-xs tracking-tight">
                    {item.label}
                  </span>
                )}

                {/* Badge "Bientôt" ou Dev pour Jeux */}
                {!iconOnly && item.badge && (
                  <span className="ml-auto rounded-full bg-primary/15 border border-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                    Bientôt
                  </span>
                )}

                {!iconOnly && isActive && !item.badge && (
                  <span className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_8px_#8B5CF6]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Section Avis / Feedback Premiers Tests ── */}
        <div className="w-full pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className={`w-full flex items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all ${
              iconOnly ? "size-[44px] justify-center" : "gap-2.5 px-3.5 py-2.5 text-left"
            }`}
            title="Donner votre avis sur la bêta"
          >
            <MessageSquareHeart size={18} className="shrink-0 text-primary" />
            {!iconOnly && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white leading-tight">Donner un avis</p>
                <p className="text-[10px] text-muted-foreground truncate">Test Bêta Nekama</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ── Modal de recueil d'avis testeurs ── */}
      <BetaFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
