"use client";

import { motion } from "framer-motion";
import { GALLERY_ITEMS } from "@/lib/constants";
import { Compass, Sparkles, Image as ImageIcon } from "lucide-react";

/**
 * Composant de présentation d'une tuile de la galerie.
 * Conçu avec des bordures lumineuses (Cyber-Shinto) et un overlay en verre dépoli.
 * 
 * @component
 * @param {object} props - Les propriétés de la tuile.
 * @param {string} props.gradient - Le dégradé CSS de fond pour la tuile.
 * @param {string} props.emoji - Le symbole représentatif.
 * @param {string} props.category - La catégorie (cosplay, fanart, etc.).
 * @param {string} props.label - Le titre descriptif de l'élément.
 * @returns {JSX.Element} La tuile de galerie stylisée.
 */
function GalleryTile({ gradient, emoji, category, label }: {
  gradient: string;
  emoji: string;
  category: string;
  label: string;
}) {
  const isCosplay = category === "cosplay";
  const glowColor = isCosplay ? "rgba(255, 62, 0, 0.4)" : "rgba(0, 245, 255, 0.4)";

  return (
    <motion.figure 
      whileHover={{ y: -6, scale: 1.02 }}
      className="w-[240px] shrink-0 sm:w-[280px] group cursor-pointer"
    >
      <div
        className="relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl border transition-all duration-300"
        style={{ 
          background: gradient,
          borderColor: isCosplay ? "rgba(255, 62, 0, 0.15)" : "rgba(0, 245, 255, 0.15)",
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`
        }}
        // Effet de lueur dynamique au survol
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 12px 36px ${glowColor}, 0 0 12px ${isCosplay ? "#FF3E00" : "#00F5FF"}`;
          e.currentTarget.style.borderColor = isCosplay ? "#FF3E00" : "#00F5FF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.3)`;
          e.currentTarget.style.borderColor = isCosplay ? "rgba(255, 62, 0, 0.15)" : "rgba(0, 245, 255, 0.15)";
        }}
      >
        {/* Symbole flottant */}
        <span aria-hidden="true" className="text-6xl select-none transform transition-transform group-hover:scale-115 duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {emoji}
        </span>

        {/* Halo néon interne */}
        <div className="absolute inset-0 bg-radial-to-t from-black/50 via-transparent to-transparent opacity-60" />
      </div>

      <figcaption className="mt-4 px-1">
        <span 
          className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border mb-2"
          style={{
            color: isCosplay ? "#FF3E00" : "#00F5FF",
            borderColor: isCosplay ? "rgba(255, 62, 0, 0.2)" : "rgba(0, 245, 255, 0.2)",
            background: isCosplay ? "rgba(255, 62, 0, 0.05)" : "rgba(0, 245, 255, 0.05)"
          }}
        >
          {isCosplay ? <Sparkles size={10} /> : <Compass size={10} />}
          {category}
        </span>
        <span className="block text-sm font-semibold text-gray-200 group-hover:text-white transition-colors line-clamp-1">
          {label}
        </span>
      </figcaption>
    </motion.figure>
  );
}

/**
 * Section Galerie de Nekama.
 * Présente les créations et photos de la communauté otaku locale via un carrousel infini.
 * 
 * @component
 * @returns {JSX.Element} La section Galerie.
 */
export default function Gallery() {
  const track = (hidden: boolean) => (
    <div className="flex shrink-0 gap-6 pr-6" aria-hidden={hidden || undefined}>
      {GALLERY_ITEMS.map((item) => (
        <GalleryTile
          key={item.id}
          gradient={item.gradient}
          emoji={item.emoji}
          category={item.category}
          label={item.label}
        />
      ))}
    </div>
  );

  return (
    <section id="gallery" className="border-t border-white/5 py-[var(--section-py)] bg-[#050507]">
      {/* En-tête de la section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-[1100px] px-[var(--px)]"
      >
        <p className="section-eyebrow text-[#FF3E00] flex items-center gap-2 font-bold tracking-widest text-xs uppercase mb-4">
          <span className="h-0.5 w-8 bg-[#FF3E00]" aria-hidden="true" />
          Galerie Bêta
        </p>
        <h2 className="max-w-[20ch] font-display text-[clamp(36px,7vw,68px)] leading-[0.95] text-white font-extrabold">
          L&apos;univers visuel de la <span className="text-[#FF3E00]">communauté 225</span>
        </h2>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-gray-400">
          Cosplays, fan arts ivoiriens, photos de rassemblements : découvre la créativité débordante de nos membres en direct.
        </p>
      </motion.div>

      {/* Carrousel infini horizontal */}
      <div className="relative overflow-hidden py-4">
        {/* Dégradés d'ombrage latéraux pour fondre la galerie dans le noir */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050507] to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050507] to-transparent sm:w-28"
        />

        {/* Piste de défilement infini */}
        <motion.div
          className="flex w-max"
          animate={{ x: [0, -1800] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {track(false)}
          {track(true)}
        </motion.div>
      </div>
    </section>
  );
}
