"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { KANJI } from "@/lib/constants";

/**
 * Nuage de particules reliées en arrière-plan.
 * S'adapte au thème via une couleur d'accent fixe (#FF3E00).
 *
 * @component
 * @returns {JSX.Element} Le canvas de particules.
 */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const color = "#FF3E00";

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const pts: Pt[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.2 + 0.4,
      a: Math.random() * 0.12 + 0.04,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d > 100) continue;
          ctx.globalAlpha = 0.03 * (1 - d / 100);
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = color;
      for (const p of pts) {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40" />;
}

/**
 * Pluie de Kanjis en arrière-plan du Hero.
 * Utilise des classes Tailwind adaptées aux deux thèmes :
 * - Mode sombre : text-[#FF3E00] à 6% d'opacité (lueur discrète sur fond noir).
 * - Mode clair  : text-[#FF3E00] à 8% d'opacité (légèrement plus visible sur fond blanc).
 *
 * @component
 * @returns {JSX.Element | null} Les kanjis animés.
 */
function KanjiRain() {
  const [drops, setDrops] = useState<
    Array<{ char: string; left: string; size: number; dur: number; delay: number }>
  >([]);

  useEffect(() => {
    setDrops(
      KANJI.slice(0, 8).map((char) => ({
        char,
        left: `${Math.random() * 85 + 5}%`,
        size: Math.random() * 24 + 16,
        dur: Math.random() * 14 + 12,
        delay: Math.random() * 5,
      })),
    );
  }, []);

  if (!drops.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {drops.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 font-jp font-bold select-none text-[#FF3E00]/[0.06] dark:text-[#FF3E00]/[0.06]"
          style={{ left: d.left, fontSize: d.size }}
          initial={{ y: -40 }}
          animate={{ y: "105svh" }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
        >
          {d.char}
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Section Hero de Nekama.
 * Utilise `bg-background` / `text-foreground` pour s'adapter au thème.
 * Contient un mockup CSS de l'interface sur desktop.
 *
 * @component
 * @returns {JSX.Element} Le Hero principal.
 */
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 pt-28 pb-20 sm:px-6 transition-colors duration-300"
    >
      {/* Halo de lueur */}
      <div className="pointer-events-none absolute -top-32 left-1/2 z-0 size-[min(600px,130vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,62,0,0.05),transparent_65%)]" />

      <ParticleCanvas />
      <KanjiRain />

      <div className="relative z-10 mx-auto grid max-w-5xl w-full gap-10 lg:grid-cols-12 lg:gap-14 items-center">

        {/* ── Texte (gauche) ── */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">

          {/* Badge bêta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF3E00]/20 bg-[#FF3E00]/5 px-3 py-1 text-[9px] font-bold tracking-[0.15em] text-[#FF3E00] uppercase"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3E00] opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#FF3E00]" />
            </span>
            Bêta ouverte
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 font-display text-[clamp(38px,7vw,72px)] leading-[0.92] font-black tracking-tight text-foreground"
          >
            La communauté NETAKAMA<br />
            de <span className="text-[#FF3E00]">Côte d&apos;Ivoire</span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 max-w-[42ch] text-sm sm:text-base leading-relaxed text-muted-foreground"
          >
            Discute avec la communauté, suis tes anime épisode par épisode et teste tes connaissances — le tout dans un seul espace pensé pour les passionnés.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start w-full"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF3E00] px-6 py-3 text-xs font-bold tracking-wide text-white uppercase transition-all hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(255,62,0,0.3)] no-underline"
            >
              Rejoindre la communauté
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase transition-colors hover:border-[#FF3E00]/40 hover:text-foreground no-underline"
            >
              <LogIn size={14} /> Se connecter
            </Link>
          </motion.div>
        </div>

        {/* ── Mockup CSS (droite, desktop only) ── */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex lg:col-span-5 justify-center"
        >
          <div className="w-full max-w-[320px] rounded-2xl border border-border bg-card p-4 shadow-2xl flex flex-col gap-3 relative overflow-hidden transition-colors duration-300">
            {/* Reflet */}
            <div className="absolute -top-10 -left-10 size-28 bg-[#FF3E00]/5 rounded-full blur-2xl pointer-events-none" />

            {/* Barre de fenêtre */}
            <div className="flex items-center gap-1.5 pb-2 border-b border-border">
              <span className="size-2 rounded-full bg-red-500/70" />
              <span className="size-2 rounded-full bg-yellow-500/70" />
              <span className="size-2 rounded-full bg-green-500/70" />
              <span className="text-[8px] text-muted-foreground font-mono ml-2">netakama.app</span>
            </div>

            {/* Post communautaire */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border flex flex-col gap-2 transition-colors">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-[#FF3E00] flex items-center justify-center text-[9px] font-bold text-white">A</div>
                <div>
                  <p className="text-[10px] font-bold text-foreground leading-none">AkiraFan225</p>
                  <p className="text-[7px] text-muted-foreground">il y a 2h</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">
                Le dernier épisode de Chainsaw Man est incroyable ! MAPPA a tout donné 🔥
              </p>
              <div className="flex gap-3 text-[7px] text-muted-foreground font-bold uppercase tracking-wider">
                <span>❤️ 24</span>
                <span>💬 12</span>
              </div>
            </div>

            {/* Anime tracker */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-3 transition-colors">
              <div className="size-10 rounded-lg bg-[#FF3E00]/10 border border-[#FF3E00]/15 flex items-center justify-center text-lg">🪚</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-bold text-foreground truncate">Chainsaw Man</p>
                  <span className="text-[7px] font-bold text-[#FF3E00]">8/12</span>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF3E00] w-2/3 rounded-full" />
                </div>
              </div>
            </div>

            {/* Quiz */}
            <div className="p-3 rounded-xl bg-[#FF3E00]/5 border border-[#FF3E00]/10 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-base">🏆</span>
                <div>
                  <p className="text-[10px] font-bold text-foreground">Quiz Hebdomadaire</p>
                  <p className="text-[7px] text-[#FF3E00] font-medium">Rang : Sannin</p>
                </div>
              </div>
              <span className="text-[7px] font-bold tracking-widest text-[#FF3E00] uppercase bg-[#FF3E00]/10 px-2 py-0.5 rounded border border-[#FF3E00]/20">
                Jouer
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
