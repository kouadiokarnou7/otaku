"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KANJI } from "@/lib/constants";

/**
 * Étoiles scintillantes en arrière-plan des pages d'authentification.
 * Utilise la couleur d'accent `#FF3E00` pour rester cohérent avec le design system.
 *
 * @component
 * @returns {JSX.Element | null} Les étoiles animées ou null si non initialisées.
 */
function Stars() {
  const [stars, setStars] = useState<Array<{
    id: number; top: string; left: string;
    size: number; duration: number; delay: number; opacity: number;
  }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.6,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.3 + 0.06,
      })),
    );
  }, []);

  if (!stars.length) return null;

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: s.opacity, scale: 0.8 }}
          animate={{ opacity: [s.opacity, 0.8, s.opacity], scale: [1, 1.3, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          className="absolute rounded-full bg-[#FF3E00] pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,62,0,0.4)`,
          }}
        />
      ))}
    </>
  );
}

/**
 * Canvas de particules connectées en arrière-plan.
 * Dessine un nuage de points reliés entre eux en couleur `#FF3E00`.
 *
 * @component
 * @returns {JSX.Element} Le canvas plein écran.
 */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const color = "#FF3E00";

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let pts: Pt[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    for (let i = 0; i < 40; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1 + 0.3,
        a: Math.random() * 0.12 + 0.03,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 100) {
            ctx.globalAlpha = 0.03 * (1 - d / 100);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = color;
      pts.forEach((p) => {
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 z-0 pointer-events-none" />;
}

/**
 * Pluie de Kanjis japonais tombants en arrière-plan.
 * Les caractères tombent lentement avec une opacité très faible.
 *
 * @component
 * @returns {JSX.Element | null} Les kanjis animés ou null si non initialisés.
 */
function KanjiRain() {
  const [items, setItems] = useState<Array<{
    char: string; left: string; fontSize: number;
    duration: number; delay: number;
  }>>([]);

  useEffect(() => {
    setItems(
      KANJI.slice(0, 12).map((k) => ({
        char: k,
        left: `${Math.random() * 90 + 5}%`,
        fontSize: Math.random() * 28 + 16,
        duration: Math.random() * 16 + 10,
        delay: Math.random() * 6,
      })),
    );
  }, []);

  if (!items.length) return null;

  return (
    <>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="absolute top-0 font-jp font-bold text-[#FF3E00]/[0.04] select-none pointer-events-none z-0"
          style={{ left: item.left, fontSize: item.fontSize }}
          initial={{ y: -50 }}
          animate={{ y: "105vh" }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </>
  );
}

/**
 * Halos de lumière diffuse en arrière-plan.
 * Crée une ambiance douce avec des dégradés radiaux.
 *
 * @component
 * @returns {JSX.Element} Les halos positionnés en absolu.
 */
function Glows() {
  return (
    <>
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,62,0,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-20 -right-12 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,62,0,0.03),transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-24 -left-16 size-64 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.02),transparent_65%)] pointer-events-none" />
    </>
  );
}

/**
 * Bouton de retour à la page d'accueil.
 * Affiché dans le coin supérieur gauche des pages d'authentification.
 *
 * @component
 * @returns {JSX.Element} Le lien animé vers la page d'accueil.
 */
function BackHome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="absolute top-5 left-5 z-10"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground no-underline px-3 py-2 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:text-[#FF3E00] hover:border-[#FF3E00]/30 hover:bg-[#FF3E00]/5"
      >
        <ArrowLeft size={14} />
        Accueil
      </Link>
    </motion.div>
  );
}

/**
 * Fond animé partagé par toutes les pages d'authentification (Login, Register).
 * Comprend un fond plein écran avec des effets visuels (particules, étoiles, kanjis, halos)
 * et un bouton de retour à l'accueil.
 * Utilise `bg-background` pour s'adapter au thème clair/sombre.
 *
 * @component
 * @returns {JSX.Element} Le fond animé avec le bouton de retour.
 */
export default function AuthBackground() {
  return (
    <>
      {/* Fond fixe plein écran */}
      <div className="fixed inset-0 bg-background z-0 pointer-events-none overflow-hidden transition-colors duration-300">
        <Glows />
        <ParticleCanvas />
        <Stars />
        <KanjiRain />
      </div>

      {/* Bouton retour */}
      <BackHome />
    </>
  );
}