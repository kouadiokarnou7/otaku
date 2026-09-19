"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/lib/hooks/store/auth/useAdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // L'état déployé/réduit vit ici, et non dans AdminSidebar : le layout
  // doit décaler <main> exactement de la largeur de la sidebar, qui est
  // en `fixed` et ne pousse donc pas le contenu d'elle-même.
  const [isExpanded, setIsExpanded] = useState(true);
  const { isAdmin, isChecking } = useAdminGuard();

  // Tant que le rôle n'est pas confirmé, aucun contenu d'administration
  // n'est peint — évite le flash d'interface avant la redirection.
  if (isChecking || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-8 animate-spin rounded-full border-2 border-muted border-t-foreground"
            role="status"
            aria-label="Vérification des droits d'accès"
          />
          <p className="text-sm text-muted-foreground">
            Vérification des droits d&apos;accès…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

      <div className="flex flex-1 pt-16">
        <AdminSidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((v) => !v)}
        />

        {/* Décalage en CSS pur (préfixe `md:`) et non calculé en JS :
            sur mobile la sidebar est un drawer qui passe par-dessus,
            donc aucune marge — et surtout aucun débordement horizontal
            au premier rendu, avant que le JS ne connaisse la largeur. */}
        <main
          className={`min-w-0 flex-1 p-4 transition-[margin] duration-300 sm:p-6 lg:p-8 ${isExpanded ? "md:ml-60" : "md:ml-[72px]"
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
