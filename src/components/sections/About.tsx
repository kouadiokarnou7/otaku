"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/lib/constants";

/**
 * Section À Propos (About) de Nekama.
 * Gère de manière dynamique les thèmes clair et sombre (Dark/Light mode)
 * via les variables sémantiques de Tailwind CSS.
 * 
 * @component
 * @returns {JSX.Element} La section À Propos.
 */
export default function About() {
  return (
    <section id="about" className="border-y border-border px-[var(--px)] py-[var(--section-py)] bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-[1100px]">
        {/* Deux colonnes : texte à gauche, visuel à droite */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* ── Colonne texte ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-eyebrow text-[#FF3E00] flex items-center gap-2 font-bold tracking-widest text-xs uppercase mb-4">
              <span className="h-0.5 w-8 bg-[#FF3E00]" aria-hidden="true" />
              {ABOUT.tag}
            </p>

            <h2 className="font-display text-[clamp(36px,7vw,68px)] leading-[0.95] text-foreground font-extrabold">
              {ABOUT.title[0]}
              <br />
              <span className="text-[#FF3E00]">{ABOUT.title[1]}</span>
              <br />
              {ABOUT.title[2]}
            </h2>

            <div className="mt-6 space-y-4">
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Chiffres clés */}
            {ABOUT.highlights && ABOUT.highlights.length > 0 && (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8">
                {ABOUT.highlights.map((highlight) => (
                  <div key={highlight.label}>
                    <dt className="mb-1 text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                      {highlight.label}
                    </dt>
                    <dd className="font-display text-4xl font-black leading-none text-foreground">
                      {highlight.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>

          {/* ── Colonne visuelle ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-3xl border border-border bg-card p-3 shadow-xl">
              <div className="flex aspect-4/3 flex-col items-center justify-center rounded-2xl bg-muted/40">
                <span aria-hidden="true" className="text-6xl select-none sm:text-7xl">
                  ⛩️
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(64px,14vw,120px)] leading-none text-foreground/[0.04] font-black select-none"
                >
                  225
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Piliers */}
        <div className="grid gap-4 sm:grid-cols-3">
          {ABOUT.pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <span aria-hidden="true" className="text-xl select-none">
                {pillar.emoji}
              </span>
              <h3 className="mt-3 mb-1.5 text-sm font-bold text-foreground">{pillar.label}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
