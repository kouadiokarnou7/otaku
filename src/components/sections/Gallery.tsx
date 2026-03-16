"use client";

import { motion, useAnimationControls } from "framer-motion";
import { GALLERY_ITEMS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
export default function Gallery() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const MotionLink= motion(Link);
  
  // On duplique les items pour créer une boucle infinie sans "coupure"
  const galleryItems = [...GALLERY_ITEMS, ...GALLERY_ITEMS];

  // Fonction pour scroller vers la section d'inscription
  const scrollToJoin = () => {
    const element = document.getElementById("join");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Gestion du défilement horizontal avec la molette de la souris
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // On empêche le défilement vertical et on applique le horizontal
      e.preventDefault();
      container.scrollLeft += e.deltaY * 2; // *2 pour accélérer un peu
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section id="gallery" style={{ padding: "96px 0", position: "relative", overflow: "hidden" }}>
      {/* Halo fond */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,26,0.04),transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: .6 }}
          style={{ textAlign: "center", marginBottom: 50, padding: "0 24px" }}
        >
          <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, color: "var(--o)", border: "1px solid rgba(255,107,26,0.3)", background: "rgba(255,107,26,0.06)" }}>
            Galerie
          </span>
          <h2 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 12, letterSpacing: -0.5 }}>
            L&apos;univers visuel de la{" "}
            <span style={{ color: "var(--o)", textShadow: "0 0 40px rgba(255,107,26,0.2)" }}>communauté</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
            Cosplays, fan arts, photos d&apos;événements — la créativité des otakus ivoiriens en images.
          </p>
        </motion.div>

        {/* --- CARROUSEL ANIMÉ INFINI --- */}
        <div 
          style={{ position: "relative", width: "100%", overflow: "hidden", cursor: "grab" }}
          ref={containerRef}
        >
          {/* Masques dégradés sur les côtés pour l'effet infini */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #050508, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #050508, transparent)", zIndex: 2, pointerEvents: "none" }} />

          <motion.div
            className="flex gap-6"
            style={{ display: "flex", gap: 24, paddingLeft: 20 }}
            animate={{
              x: [0, -1500], // Défile vers la gauche
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25, // Vitesse de défilement (plus c'est haut, plus c'est lent)
                  ease: "linear",
                },
              },
            }}
            // On ralentit fortement au survol pour que l'utilisateur puisse cliquer
            whileHover={{ transition: { duration: 0.5 } }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  minWidth: 280,
                  height: 380,
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: item.gradient,
                  flexShrink: 0,
                  userSelect: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
              >
                {/* Emoji */}
                <div style={{ position: "absolute", top: 16, left: 16, fontSize: 28, userSelect: "none", filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}>
                  {item.emoji}
                </div>

                {/* Overlay Gradient Bottom */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 10, color: "var(--o)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4, textTransform: "uppercase" }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                    {item.label}
                  </span>
                </div>

                {/* Hover Overlay lumineux */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,107,26,0.15), rgba(124,63,219,0.15))", mixBlendMode: "overlay" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- BOUTON CTA --- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <MotionLink
            href="/feed"
            
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,107,26,0.5)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#FF6B1A",
              color: "#fff",
              border: "none",
              borderRadius: 50,
              padding: "16px 36px",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            Rejoindre l&apos;aventure <ArrowRight size={18} />
          </MotionLink>
        </motion.div>

      </div>
    </section>
  );
}