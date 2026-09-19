"use client";

import { Swords } from "lucide-react";
import Link from "next/link";

/**
 * Footer minimal de Nekama.
 * Affiche le logo, 3 liens légaux et le copyright.
 * Utilise les variables sémantiques pour le thème.
 *
 * @component
 * @returns {JSX.Element} Le pied de page.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-6 px-4 sm:px-6 transition-colors duration-300">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Swords size={20} className="text-[#FF3E00]" />
          <span className="font-display text-lg font-black tracking-wide text-foreground">
            NETAKAMA
          </span>
        </Link>

        {/* Liens légaux */}
        <div className="flex gap-5 text-[11px] text-muted-foreground font-medium">
          <a href="#" className="hover:text-foreground transition-colors no-underline">Confidentialité</a>
          <a href="#" className="hover:text-foreground transition-colors no-underline">Conditions</a>
          <a href="#" className="hover:text-foreground transition-colors no-underline">Contact</a>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-muted-foreground/50 font-mono">&copy; {year} NETAKAMA</p>
      </div>
    </footer>
  );
}