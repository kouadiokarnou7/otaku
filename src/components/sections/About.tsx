"use client";

import { motion } from "framer-motion";
import { ABOUT } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" style={{ padding:"96px 24px", position:"relative", overflow:"hidden" }}>
      {/* Séparateur */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(192,57,43,0.2),transparent)" }} />

      {/* Halo fond droit */}
      <div style={{ position:"absolute",right:-100,top:"40%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(192,57,43,0.05),transparent 65%)",pointerEvents:"none" }} />

      <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* Layout alterné : texte gauche / visuel droit */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,420px),1fr))", gap:"48px 64px", alignItems:"center", marginBottom:64 }}>

          {/* ─ Côté Texte ─ */}
          <motion.div
            initial={{ opacity:0, x:-30 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.65, ease:[.16,1,.3,1] }}
          >
            <span style={{ display:"inline-block",padding:"4px 14px",borderRadius:99,fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:20,color:"#C0392B",border:"1px solid rgba(192,57,43,0.35)",background:"rgba(192,57,43,0.08)" }}>
              {ABOUT.tag}
            </span>

            <h2 style={{ fontSize:"clamp(26px,5vw,44px)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:24, letterSpacing:-0.5 }}>
              {ABOUT.title[0]}{" "}<br />
              <span style={{ color:"#FF6B1A", textShadow:"0 0 40px rgba(255,107,26,0.25)" }}>
                {ABOUT.title[1]}
              </span>{" "}<br />
              {ABOUT.title[2]}
            </h2>

            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize:14,color:"rgba(255,255,255,0.42)",lineHeight:1.75,marginBottom:14 }}>
                {p}
              </p>
            ))}

            {/* Highlights */}
            <div style={{ display:"flex",gap:32,marginTop:28,marginBottom:28,flexWrap:"wrap" }}>
              {ABOUT.highlights.map((h) => (
                <div key={h.label}>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>
                    {h.label}
                  </div>
                  <div style={{ fontSize:20,fontWeight:900,color:"#fff" }}>{h.value}</div>
                </div>
              ))}
            </div>

            
          </motion.div>

          {/* ─ Côté Visuel ─ */}
          <motion.div
            initial={{ opacity:0, x:30 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.65, ease:[.16,1,.3,1], delay:.1 }}
            style={{ position:"relative" }}
          >
            {/* Card principale */}
            <div style={{ borderRadius:20,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(14,14,20,0.6)",padding:3 }}>
              <div style={{ borderRadius:18,overflow:"hidden",aspectRatio:"4/3",background:"linear-gradient(135deg,#0d0d16,#050508)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                {/* Motif hachuré */}
                <div style={{ position:"absolute",inset:0,opacity:.04,backgroundImage:"repeating-linear-gradient(45deg,rgba(255,107,26,.6) 0,rgba(255,107,26,.6) 1px,transparent 1px,transparent 20px)" }} />
                {/* Décor central */}
                <div style={{ textAlign:"center",position:"relative",zIndex:1 }}>
                  <div style={{ fontSize:72,marginBottom:8,userSelect:"none" }}>⛩️</div>
                  <div style={{ fontSize:52,fontWeight:900,color:"rgba(255,255,255,0.04)",userSelect:"none",letterSpacing:-2 }}>225</div>
                </div>
                {/* Orbes */}
                <div style={{ position:"absolute",top:16,right:16,width:60,height:60,borderRadius:"50%",background:"rgba(255,107,26,.12)",filter:"blur(20px)" }} />
                <div style={{ position:"absolute",bottom:16,left:16,width:40,height:40,borderRadius:"50%",background:"rgba(192,57,43,.15)",filter:"blur(16px)" }} />
              </div>
            </div>

            {/* Badge flottant haut-gauche */}
            <motion.div
              initial={{ opacity:0,scale:.8 }} whileInView={{ opacity:1,scale:1 }}
              viewport={{ once:true }} transition={{ delay:.4 }}
              style={{ position:"absolute",top:-16,left:-16,background:"#0d0d16",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"10px 16px",boxShadow:"0 8px 32px rgba(0,0,0,.6)" }}
            >
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:2 }}>Membres</div>
              <div style={{ fontSize:22,fontWeight:900,color:"#fff",lineHeight:1 }}>12K+</div>
            </motion.div>

            {/* Badge flottant bas-droit */}
            <motion.div
              initial={{ opacity:0,scale:.8 }} whileInView={{ opacity:1,scale:1 }}
              viewport={{ once:true }} transition={{ delay:.55 }}
              style={{ position:"absolute",bottom:-16,right:-16,background:"#0d0d16",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"10px 16px",boxShadow:"0 8px 32px rgba(0,0,0,.6)" }}
            >
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:2 }}>Abidjan 🇨🇮</div>
              <div style={{ fontSize:13,fontWeight:700,color:"#fff" }}>Fondé en 2026</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Piliers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))", gap:12 }}>
          {ABOUT.pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity:0,y:20 }}
              whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }}
              transition={{ duration:.5, delay:i*0.1 }}
              style={{ display:"flex",gap:14,padding:18,borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)" }}
            >
              <div style={{ fontSize:22,lineHeight:1,marginTop:2,userSelect:"none" }}>{p.emoji}</div>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:"#fff",marginBottom:4 }}>{p.label}</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.55 }}>{p.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}