"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_ITEMS, GALLERY_FILTERS } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/types";

export default function Gallery() {
  const [active, setActive] = useState<GalleryCategory | "all">("all");

  const filtered = active === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === active);

  return (
    <section id="gallery" style={{ padding:"96px 24px", position:"relative", overflow:"hidden" }}>
      {/* Séparateur */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.15),transparent)" }} />

      {/* Halo fond */}
      <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:800,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,0.03),transparent 70%)",pointerEvents:"none" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:.6 }}
          style={{ textAlign:"center", marginBottom:40 }}
        >
          <span style={{ display:"inline-block",padding:"4px 14px",borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16,color:"#00D4FF",border:"1px solid rgba(0,212,255,0.3)",background:"rgba(0,212,255,0.06)" }}>
            Galerie
          </span>
          <h2 style={{ fontSize:"clamp(26px,5vw,44px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:12,letterSpacing:-0.5 }}>
            L&apos;univers visuel de la{" "}
            <span style={{ color:"#00D4FF",textShadow:"0 0 40px rgba(0,212,255,0.2)" }}>communauté</span>
          </h2>
          <p style={{ fontSize:14,color:"rgba(255,255,255,0.38)",maxWidth:440,margin:"0 auto",lineHeight:1.65 }}>
            Cosplays, fan arts, photos d&apos;événements — la créativité des otakus ivoiriens en images.
          </p>
        </motion.div>

        {/* Filtres */}
        <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28 }}>
          {GALLERY_FILTERS.map((f) => {
            const isActive = active === f.value;
            return (
              <motion.button
                key={f.value}
                onClick={() => setActive(f.value as GalleryCategory | "all")}
                whileTap={{ scale:.95 }}
                style={{
                  padding:"6px 16px", borderRadius:99, fontSize:11, fontWeight:700, cursor:"pointer", transition:"all .2s",
                  border: isActive ? "1px solid rgba(0,212,255,0.5)"  : "1px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(0,212,255,0.1)"        : "transparent",
                  color:      isActive ? "#00D4FF"                    : "rgba(255,255,255,0.35)",
                }}
              >
                {f.label}
              </motion.button>
            );
          })}
        </div>

        {/* Grille masonry
            Mobile  : 2 colonnes égales
            Desktop : colonnes 4 avec span pour les items "tall" et "wide"
        */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridAutoRows: 160,
            gap: 10,
          }}
          /* Desktop override via class */
          className="gallery-grid"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity:0, scale:.9 }}
                animate={{ opacity:1, scale:1 }}
                exit={{ opacity:0, scale:.85 }}
                transition={{ duration:.35, delay: i * 0.05 }}
                whileHover={{ scale:1.03, zIndex:10 }}
                style={{
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: item.gradient,
                }}
                className={[
                  item.span === "tall" ? "gallery-tall"  : "",
                  item.span === "wide" ? "gallery-wide"  : "",
                ].join(" ")}
              >
                {/* Emoji */}
                <div style={{ position:"absolute",top:10,left:10,fontSize:22,userSelect:"none",filter:"drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}>
                  {item.emoji}
                </div>

                {/* Overlay au hover */}
                <motion.div
                  initial={{ opacity:0 }}
                  whileHover={{ opacity:1 }}
                  style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:12,textAlign:"center" }}
                >
                  <span style={{ fontSize:9,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6 }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3 }}>
                    {item.label}
                  </span>
                </motion.div>

                {/* Légende mobile (toujours visible) */}
                <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"8px 12px",background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)" }}>
                  <p style={{ fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA bas */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ delay:.3 }}
          style={{ textAlign:"center", marginTop:36 }}
        >
          <motion.button
            whileHover={{ borderColor:"rgba(0,212,255,0.4)",color:"#00D4FF" }}
            style={{ background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"11px 26px",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.38)",cursor:"pointer",transition:"all .2s" }}
          >
            Voir plus de créations →
          </motion.button>
        </motion.div>
      </div>

      {/* Styles responsive pour la grille */}
      <style>{`
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            grid-auto-rows: 190px !important;
          }
          .gallery-tall { grid-row: span 2; }
          .gallery-wide { grid-column: span 2; }
        }
      `}</style>
    </section>
  );
}