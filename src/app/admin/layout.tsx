"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/lib/hooks/store/auth/useAdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />

      <div style={{ display: "flex", flex: 1, marginTop: 64 }}>
        <AdminSidebar isOpen={isMenuOpen} />

        {/* Content Area */}
        <main
          style={{
            flex: 1,
            marginLeft: 0, // La sidebar est fixed
            padding: "24px",
            overflowY: "auto",
          }}
          className="md:ml-0"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
