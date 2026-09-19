"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Trophy } from "lucide-react";

/**
 * Données des 3 fonctionnalités MVP, définies localement pour simplicité.
 */
const FEATURES = [
  {
    icon: Users,
    color: "#FF3E00",
    title: "Communauté",
    desc: "Discute anime, manga et mangas africains avec la communauté.",
  },
  {
    icon: BookOpen,
    color: "#00F5FF",
    title: "Anime Tracker",
    desc: "Suis tes animes, épisode par épisode.",
  },
  {
    icon: Trophy,
    color: "#F39C12",
    title: "Quiz",
    desc: "Teste tes connaissances et grimpe au classement.",
  },
] as const;

/**
 * Section Fonctionnalités de Nekama.
 * Affiche exactement 3 cartes en **ligne** (horizontal) sur desktop
 * et empilées sur mobile. Utilise les variables sémantiques Tailwind
 * pour s'adapter au thème clair/sombre.
 *
 * @component
 * @returns {JSX.Element} La section des fonctionnalités.
 */
export default function Features() {
  return (
    <section
      id="features"
      className="border-y border-border px-4 py-20 sm:py-28 sm:px-6 bg-background text-foreground transition-colors duration-300"
    >
      <div className="mx-auto max-w-4xl">

        {/* Titre de section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-[clamp(28px,5vw,48px)] leading-[1.05] font-black text-foreground">
            Tout ton univers Otaku,<br />
            <span className="text-[#FF3E00]">au même endroit.</span>
          </h2>
        </motion.div>

        {/* Grille : 3 cartes en ligne */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:border-[color:var(--accent)] hover:shadow-lg"
                style={{ "--accent": feat.color } as React.CSSProperties}
              >
                {/* Icône */}
                <div
                  className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl transition-colors"
                  style={{ backgroundColor: `${feat.color}12`, color: feat.color }}
                >
                  <Icon size={22} />
                </div>

                {/* Titre */}
                <h3 className="mb-2 text-base font-bold text-foreground">{feat.title}</h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
