"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Section CTA finale de la landing page.
 * Reprend l'appel à l'action principal avec un message clair et un bouton centré.
 * Utilise les variables sémantiques Tailwind pour la bascule de thème.
 *
 * @component
 * @returns {JSX.Element} La section CTA final.
 */
export default function CTASection() {
  return (
    <section className="px-4 py-20 sm:py-28 sm:px-6 bg-background text-foreground transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        {/* Titre */}
        <h2 className="mb-4 font-display text-[clamp(28px,5vw,48px)] leading-[1.05] font-black text-foreground">
          Prêt à rejoindre <span className="text-[#FF3E00]">NETAKAMA</span> ?
        </h2>

        {/* Sous-titre */}
        <p className="mb-8 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[40ch] mx-auto">
          Rejoins la communauté et commence à construire ton univers anime &amp; manga.
        </p>

        {/* Bouton principal */}
        <Link
          href="/register"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF3E00] px-7 py-3.5 text-xs font-bold tracking-wide text-white uppercase transition-all hover:bg-orange-600 hover:shadow-[0_0_24px_rgba(255,62,0,0.3)] no-underline"
        >
          Rejoindre NETAKAMA
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Lien secondaire */}
        <p className="mt-5 text-xs text-muted-foreground">
          Déjà membre ?{" "}
          <Link href="/login" className="font-semibold text-[#FF3E00] hover:underline no-underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
