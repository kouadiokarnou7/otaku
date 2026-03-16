"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swords, ChevronDown } from "lucide-react"; // Retrait de Play et ArrowRight
import { ANIME_TITLES, KANJI } from "../../lib/constants";
import Link from "next/link";

// ── Composants Background (Particules, Étoiles, Kanji) ──
// (Inclus ici pour que le fichier soit complet et autonome)

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!; let animId: number;
    type Pt = { x: number; y: number; vx: number; vy: number; r: number; a: number; orange: boolean };
    let pts: Pt[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize, { passive: true });
    const spawn = (): Pt => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.25 + 0.05,
      orange: Math.random() > 0.6
    });
    for (let i = 0; i < 70; i++) pts.push(spawn());
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Dessine les lignes
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(255,107,26,${0.05 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      // Dessine les points
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.orange ? `rgba(255,107,26,${p.a})` : `rgba(124,63,219,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function StarField() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; }>>([]);
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 1, duration: Math.random() * 3 + 2, delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);
  if (stars.length === 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((star) => (
        <motion.div key={star.id} style={{ position: "absolute", left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, borderRadius: "50%", backgroundColor: "rgba(255, 107, 26, 0.8)", boxShadow: "0 0 10px rgba(255, 107, 26, 0.6)" }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function KanjiRain() {
  const [kanjiData, setKanjiData] = useState<Array<{ char: string; left: string; fontSize: number; duration: number; delay: number; repeatDelay: number; }>>([]);
  useEffect(() => {
    const generatedData = KANJI.map((k) => ({
      char: k, left: `${Math.random() * 95 + 2}%`, fontSize: Math.random() * 50 + 26,
      duration: Math.random() * 18 + 12, delay: Math.random() * 8, repeatDelay: Math.random() * 6,
    }));
    setKanjiData(generatedData);
  }, []);
  if (kanjiData.length === 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1, pointerEvents: "none" }}>
      {kanjiData.map((item, i) => (
        <motion.span key={i} initial={{ y: -80, opacity: 0.05 }} animate={{ y: "105vh", opacity: 0 }}
          transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, repeatDelay: item.repeatDelay, ease: "linear" }}
          style={{ position: "absolute", left: item.left, fontFamily: "var(--f-jp)", fontWeight: 700, fontSize: item.fontSize, color: "rgba(255,107,26,0.05)", userSelect: "none" }}>
          {item.char}
        </motion.span>
      ))}
    </div>
  );
}

function Marquee() {
  const doubled = [...ANIME_TITLES, ...ANIME_TITLES];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--bdr)", borderBottom: "1px solid var(--bdr)", padding: "13px 0", background: "rgba(255,107,26,0.02)", position: "relative", zIndex: 10 }}>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 44, width: "max-content", whiteSpace: "nowrap" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--f-display)", fontSize: 20, letterSpacing: 2, color: "var(--dim)" }}>
            <b style={{ color: "var(--o)", fontWeight: 400 }}>{t}</b>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--o)", opacity: 0.3, display: "inline-block" }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── MAIN HERO COMPONENT ──
export default function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section id="home" style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 100px", overflow: "hidden", zIndex: 2 }}>
        
        {/* Glows & Backgrounds */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,26,0.07), transparent 60%)", top: -160, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,26,0.03), transparent 65%)", bottom: -80, right: -60, pointerEvents: "none", zIndex: 0 }} />
        
        <ParticleCanvas />
        <StarField />
        <KanjiRain />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--o-dim)", border: "1px solid var(--o-bdr)", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: "var(--o-l)", letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 28, position: "relative", zIndex: 2 }}>
          <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--o)", display: "inline-block" }} />
          Bêta ouverte — Places limitées
        </motion.div>

        {/* Title */}
        <div style={{ position: "relative", zIndex: 2, marginBottom: 10 }}>
          <motion.span initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "block", fontFamily: "var(--f-display)", fontSize: "clamp(68px,13vw,158px)", lineHeight: 0.87, letterSpacing: 2, color: "#fff" }}>
            LA CULTURE
          </motion.span>
          <motion.span initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "block", fontFamily: "var(--f-display)", fontSize: "clamp(68px,13vw,158px)", lineHeight: 0.87, letterSpacing: 2, color: "var(--o)", textShadow: "0 0 60px rgba(255,107,26,0.2)" }}>
            OTAKU 225
          </motion.span>
        </div>

        {/* JP Subtitle */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}
          style={{ fontFamily: "var(--f-jp)", fontSize: 15, letterSpacing: 10, color: "rgba(255,107,26,0.25)", marginBottom: 26, position: "relative", zIndex: 2 }}>
          オタク二百二十五 — CÔTE D&apos;IVOIRE
        </motion.p>

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.78 }}
          style={{ maxWidth: 500, fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: 48, position: "relative", zIndex: 2 }}>
          Le premier réseau social pensé pour les{" "}
          <strong style={{ color: "#fff" }}>otakus ivoiriens</strong>.
          Rejoins la bêta, sois parmi les fondateurs.
        </motion.p>

        {/* --- BOUTON CALL TO ACTION UNIQUE --- */}
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ position: "relative", zIndex: 2 }}
        > 
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,107,26,0.6)" }}
            whileTap={{ scale: 0.95 }}
          
            style={{
              // Style augmenté pour un impact fort
              padding: "18px 50px",
              background: "linear-gradient(135deg, var(--o), #ff8c42)",
              border: "none",
              borderRadius: 50, // Pilule bien ronde
              fontFamily: "var(--f-body)",
              fontWeight: 800,
              fontSize: 16, // Texte plus lisible
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              boxShadow: "0 10px 30px rgba(255, 107, 26, 0.3)"
            }}
          >
            <Link href="register">
            Rejoindre l'aventure</Link>
            
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, zIndex: 2 }}>
          <span style={{ fontSize: 9, color: "var(--dim)", letterSpacing: 2.5, textTransform: "uppercase" }}>Scroll</span>
          <motion.div animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--o), transparent)" }} />
          <ChevronDown size={12} color="var(--dim)" />
        </motion.div>
      </section>

      <Marquee />
    </>
  );
}