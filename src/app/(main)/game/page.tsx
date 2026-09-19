"use client";

import { motion } from "framer-motion";
import { Gamepad2, ArrowLeft, Trophy, Flame } from "lucide-react";
import Link from "next/link";

export default function GameQuizPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center">
      {/* ── Icône animée ── */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <div className="size-20 rounded-3xl bg-gradient-to-tr from-violet-600/30 via-primary/20 to-indigo-500/30 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <Gamepad2 size={36} className="text-primary animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#10B981] text-white text-[10px] font-bold shadow-md">
          XP
        </div>
      </motion.div>

      {/* ── Badge ── */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
        <Trophy size={13} />
        <span>Arène & Quiz Otaku</span>
      </div>

      <h1 className="font-heading text-2xl font-bold tracking-tight text-white mb-2">
        Quiz & Duels de Connaissance
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        Cette arène est actuellement <strong className="text-white">en cours de développement 🚧</strong>.
        Prépare tes connaissances sur les shonens, seinen et classiques pour grimper dans le classement des maîtres otakus !
      </p>

      {/* ── Teaser des modes de jeu ── */}
      <div className="w-full max-w-xs p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm mb-6 text-left space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Flame size={12} className="text-[#EF4444]" />
          Modes prévus :
        </p>
        <ul className="text-xs text-foreground/80 space-y-2">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Quiz thématiques hebdomadaires par anime
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Duels rapides 1 contre 1 en temps réel
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            Badges exclusifs et points d'XP
          </li>
        </ul>
      </div>

      {/* ── Bouton Retour au Feed ── */}
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all no-underline"
      >
        <ArrowLeft size={16} />
        <span>Retour à l'accueil</span>
      </Link>
    </div>
  );
}
