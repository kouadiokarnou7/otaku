"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
