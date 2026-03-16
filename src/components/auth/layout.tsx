"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ── Étoiles scintillantes ────────────────────────────────────
function Stars() {
  const [stars, setStars] = useState<Array<{
    id: number; top: string; left: string;
    size: number; duration: number; delay: number; opacity: number;
  }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 50 }).map((_, i) => ({
        id:       i,
        top:      `${Math.random() * 100}%`,
        left:     `${Math.random() * 100}%`,
        size:     Math.random() * 2.5 + 0.8,
        duration: Math.random() * 3 + 2,
        delay:    Math.random() * 3,
        opacity:  Math.random() * 0.45 + 0.08,
      }))
    );
  }, []);

  if (stars.length === 0) return null;

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: s.opacity, scale: 0.8 }}
          animate={{ opacity: [s.opacity, 1, s.opacity], scale: [1, 1.5, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          style={{
            position:     "absolute",
            top:          s.top,
            left:         s.left,
            width:        s.size,
            height:       s.size,
            borderRadius: "50%",
            background:   "#FF6B1A",
            boxShadow:    `0 0 ${s.size * 2.5}px rgba(255,107,26,0.55)`,
            pointerEvents:"none",
          }}
        />
      ))}
    </>
  );
}

// ── Particules connectées (canvas) ───────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    type Pt = { x:number; y:number; vx:number; vy:number; r:number; a:number };
    let pts: Pt[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const spawn = (): Pt => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r:  Math.random() * 1 + 0.3,
      a:  Math.random() * 0.18 + 0.04,
    });

    for (let i = 0; i < 55; i++) pts.push(spawn());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(255,107,26,${0.04 * (1 - d / 120)})`;
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,26,${p.a})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ── Kanji tombants ───────────────────────────────────────────
import { KANJI } from "@/lib/constants";

function KanjiRain() {
  const [items, setItems] = useState<Array<{
    char: string; left: string; fontSize: number;
    duration: number; delay: number; repeatDelay: number;
  }>>([]);

  useEffect(() => {
    setItems(
      KANJI.map((k) => ({
        char:        k,
        left:        `${Math.random() * 95 + 2}%`,
        fontSize:    Math.random() * 30 + 18,
        duration:    Math.random() * 16 + 10,
        delay:       Math.random() * 6,
        repeatDelay: Math.random() * 5,
      }))
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ y: -60, opacity: 0.04 }}
          animate={{ y: "105vh", opacity: 0 }}
          transition={{
            duration:    item.duration,
            delay:       item.delay,
            repeat:      Infinity,
            repeatDelay: item.repeatDelay,
            ease:        "linear",
          }}
          style={{
            position:   "absolute",
            left:       item.left,
            fontSize:   item.fontSize,
            fontWeight: 700,
            color:      "rgba(255,107,26,0.05)",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </>
  );
}

// ── Halos de fond ────────────────────────────────────────────
function Glows() {
  return (
    <>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,26,0.06),transparent 60%)", top:-140, left:"50%", transform:"translateX(-50%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,26,0.03),transparent 65%)", bottom:-80, right:-50, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"absolute", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,255,0.02),transparent 65%)", bottom:100, left:-60, pointerEvents:"none", zIndex:0 }} />
    </>
  );
}

// ── Bouton retour accueil ────────────────────────────────────
function BackHome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}
    >
      <Link
        href="/"
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            6,
          fontSize:       13,
          fontWeight:     600,
          color:          "rgba(255,255,255,0.4)",
          textDecoration: "none",
          padding:        "8px 14px",
          borderRadius:   10,
          border:         "1px solid rgba(255,255,255,0.07)",
          background:     "rgba(255,255,255,0.03)",
          backdropFilter: "blur(8px)",
          transition:     "all .2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color        = "#FF6B1A";
          (e.currentTarget as HTMLElement).style.borderColor  = "rgba(255,107,26,0.35)";
          (e.currentTarget as HTMLElement).style.background   = "rgba(255,107,26,0.06)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color        = "rgba(255,255,255,0.4)";
          (e.currentTarget as HTMLElement).style.borderColor  = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLElement).style.background   = "rgba(255,255,255,0.03)";
        }}
      >
        <ArrowLeft size={14} />
        Accueil
      </Link>
    </motion.div>
  );
}

// ── Composant principal exporté ──────────────────────────────
export default function AuthBackground() {
  return (
    <>
      {/* Fond fixe plein écran */}
      <div style={{ position: "fixed", inset: 0, background: "#050508", zIndex: 0, pointerEvents: "none" }}>
        <Glows />
        <ParticleCanvas />
        <Stars />
        <KanjiRain />
      </div>

      {/* Bouton retour (par-dessus tout) */}
      <BackHome />
    </>
  );
}