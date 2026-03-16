"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

function FeatureCard({ icon: Icon, title, description, accent, tag, index }: {
  icon: LucideIcon; title: string; description: string;
  accent: string; tag: string; index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{
        position: "relative", padding: "24px", borderRadius: 16, cursor: "default",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(160deg,rgba(255,255,255,0.025) 0%,transparent 100%)",
        overflow: "hidden",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}35`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {/* Ligne top accent */}
      <span style={{ position:"absolute",top:0,left:0,width:48,height:2,background:`linear-gradient(90deg,${accent},transparent)`,borderRadius:"0 0 4px 0" }} />

      {/* Tag */}
      <span style={{ display:"inline-block",padding:"2px 10px",borderRadius:99,fontSize:9,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14,color:accent,border:`1px solid ${accent}35`,background:`${accent}10` }}>
        {tag}
      </span>

      {/* Icon */}
      <div style={{ width:44,height:44,borderRadius:10,background:`${accent}12`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
        <Icon size={21} color={accent} />
      </div>

      <h3 style={{ fontSize:15,fontWeight:700,color:"#fff",marginBottom:8,lineHeight:1.3 }}>{title}</h3>
      <p  style={{ fontSize:13,color:"rgba(255,255,255,0.38)",lineHeight:1.65 }}>{description}</p>
    </motion.article>
  );
}

export default function Features() {
  return (
    <section id="features" style={{ padding:"96px 24px", position:"relative", overflow:"hidden" }}>
      {/* Séparateur */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,107,26,0.2),transparent)" }} />

      {/* Halo de fond */}
      <div style={{ position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,26,0.04),transparent 70%)",pointerEvents:"none" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:.6 }}
          style={{ textAlign:"center", marginBottom:56 }}
        >
          <span style={{ display:"inline-block",padding:"4px 14px",borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16,color:"#FF6B1A",border:"1px solid rgba(255,107,26,0.3)",background:"rgba(255,107,26,0.08)" }}>
            Fonctionnalités
          </span>
          <h2 style={{ fontSize:"clamp(26px,5vw,44px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:12,letterSpacing:-0.5 }}>
            Tout ce dont un{" "}
            <span style={{ color:"#FF6B1A",textShadow:"0 0 40px rgba(255,107,26,0.25)" }}>vrai Otaku</span>{" "}
            a besoin
          </h2>
          <p style={{ fontSize:15,color:"rgba(255,255,255,0.38)",maxWidth:460,margin:"0 auto",lineHeight:1.65 }}>
            Une plateforme pensée pour la communauté ivoirienne, avec des outils qui font vraiment la différence.
          </p>
        </motion.div>

        {/* Grid : 1 col → 2 col → 3 col */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))", gap:14 }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>

        {/* CTA bas */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ delay:.3 }}
          style={{ textAlign:"center", marginTop:44 }}
        >
          <motion.button
            whileHover={{ borderColor:"rgba(255,107,26,0.45)",color:"#FF6B1A" }}
            style={{ background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"11px 26px",fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.38)",cursor:"pointer",transition:"all .2s" }}
          >
            Voir la roadmap complète →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}