"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swords, Play, ChevronDown } from "lucide-react";
import { ANIME_TITLES, KANJI } from "@/lib/constants";

// ── Étoiles Orange Scintillantes ────────────────────────────
function OrangeStars() {
  const [stars, setStars] = useState<Array<{
    id: number; top: string; left: string;
    size: number; duration: number; delay: number; opacity: number;
  }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top:      `${Math.random() * 100}%`,
        left:     `${Math.random() * 100}%`,
        size:     Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay:    Math.random() * 2,
        opacity:  Math.random() * 0.5 + 0.1,
      }))
    );
  }, []);

  if (stars.length === 0) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden" }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: star.opacity, scale: 0.8 }}
          animate={{ opacity:[star.opacity,1,star.opacity], scale:[1,1.4,1] }}
          transition={{ duration:star.duration, repeat:Infinity, delay:star.delay, ease:"easeInOut" }}
          style={{ position:"absolute", top:star.top, left:star.left, width:star.size, height:star.size, borderRadius:"50%", background:"#FF6B1A", boxShadow:`0 0 ${star.size*2}px rgba(255,107,26,0.6)` }}
        />
      ))}
    </div>
  );
}

// ── Particles Canvas ────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!; let animId: number;
    type Pt = { x:number;y:number;vx:number;vy:number;r:number;a:number };
    let pts: Pt[] = [];
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize(); window.addEventListener("resize",resize,{passive:true});
    const spawn = (): Pt => ({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, r:Math.random()*1.2+.3, a:Math.random()*.25+.05 });
    for (let i=0;i<70;i++) pts.push(spawn());
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if (d<110) { ctx.strokeStyle=`rgba(255,107,26,${.05*(1-d/110)})`; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,107,26,${p.a})`; ctx.fill(); p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>canvas.width)p.vx*=-1; if(p.y<0||p.y>canvas.height)p.vy*=-1; });
      animId=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none" }} />;
}

// ── Pluie de Kanji ──────────────────────────────────────────
function KanjiRain() {
  const [kanjiData, setKanjiData] = useState<Array<{
    char:string; left:string; fontSize:number; duration:number; delay:number; repeatDelay:number;
  }>>([]);

  useEffect(() => {
    setKanjiData(
      KANJI.map((k) => ({
        char: k, left:`${Math.random()*95+2}%`,
        fontSize:Math.random()*50+26, duration:Math.random()*18+12,
        delay:Math.random()*8, repeatDelay:Math.random()*6,
      }))
    );
  }, []);

  if (kanjiData.length === 0) return null;

  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",zIndex:1,pointerEvents:"none" }}>
      {kanjiData.map((item,i) => (
        <motion.span
          key={i}
          initial={{ y:-80, opacity:0.05 }}
          animate={{ y:"105vh", opacity:0 }}
          transition={{ duration:item.duration, delay:item.delay, repeat:Infinity, repeatDelay:item.repeatDelay, ease:"linear" }}
          style={{ position:"absolute", left:item.left, fontWeight:700, fontSize:item.fontSize, color:"rgba(255,107,26,0.05)", userSelect:"none" }}
        >
          {item.char}
        </motion.span>
      ))}
    </div>
  );
}

// ── Marquee ──────────────────────────────────────────────────
function Marquee() {
  const doubled = [...ANIME_TITLES, ...ANIME_TITLES];
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,107,26,0.12)", borderBottom:"1px solid rgba(255,107,26,0.12)", padding:"13px 0", background:"rgba(255,107,26,0.02)", position:"relative", zIndex:10 }}>
      <motion.div
        animate={{ x:["0%","-50%"] }}
        transition={{ duration:28, repeat:Infinity, ease:"linear" }}
        style={{ display:"flex", gap:44, width:"max-content", whiteSpace:"nowrap" }}
      >
        {doubled.map((t,i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:10, fontSize:18, letterSpacing:2, color:"rgba(255,255,255,0.3)" }}>
            <b style={{ color:"#FF6B1A", fontWeight:500 }}>{t}</b>
            <span style={{ width:5,height:5,borderRadius:"50%",background:"#FF6B1A",opacity:.3,display:"inline-block" }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Hero Principal ───────────────────────────────────────────
export default function HeroSection() {
  const scrollTo = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <>
      <section id="home" style={{ minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"140px 24px 100px", overflow:"hidden", zIndex:2 }}>

        {/* Gradients de fond */}
        <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,26,0.07),transparent 60%)",top:-160,left:"50%",transform:"translateX(-50%)",pointerEvents:"none",zIndex:0 }} />
        <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,26,0.03),transparent 65%)",bottom:-80,right:-60,pointerEvents:"none",zIndex:0 }} />

        <ParticleCanvas />
        <OrangeStars />
        <KanjiRain />

        {/* Badge */}
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:.6,delay:.15 }}
          style={{ display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,107,26,0.08)",border:"1px solid rgba(255,107,26,0.25)",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,color:"rgba(255,150,80,0.9)",letterSpacing:1.6,textTransform:"uppercase",marginBottom:28,position:"relative",zIndex:2 }}>
          <motion.span animate={{ opacity:[1,.3,1],scale:[1,1.5,1] }} transition={{ duration:1.4,repeat:Infinity }}
            style={{ width:5,height:5,borderRadius:"50%",background:"#FF6B1A",display:"inline-block" }} />
          Bêta ouverte — Places limitées
        </motion.div>

        {/* Titre */}
        <div style={{ position:"relative",zIndex:2,marginBottom:10 }}>
          <motion.span initial={{ opacity:0,x:-40 }} animate={{ opacity:1,x:0 }} transition={{ duration:.75,delay:.3,ease:[.16,1,.3,1] }}
            style={{ display:"block",fontSize:"clamp(52px,11vw,140px)",lineHeight:.87,letterSpacing:2,color:"#fff",fontWeight:900 }}>
            LA CULTURE
          </motion.span>
          <motion.span initial={{ opacity:0,x:40 }} animate={{ opacity:1,x:0 }} transition={{ duration:.75,delay:.45,ease:[.16,1,.3,1] }}
            style={{ display:"block",fontSize:"clamp(52px,11vw,140px)",lineHeight:.87,letterSpacing:2,color:"#FF6B1A",fontWeight:900,textShadow:"0 0 60px rgba(255,107,26,0.2)" }}>
            OTAKU 225
          </motion.span>
        </div>

        {/* JP */}
        <motion.p initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:.6,delay:.65 }}
          style={{ fontSize:14,letterSpacing:10,color:"rgba(255,107,26,0.25)",marginBottom:26,position:"relative",zIndex:2 }}>
          オタク二百二十五 — CÔTE D&apos;IVOIRE
        </motion.p>

        {/* Description */}
        <motion.p initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:.6,delay:.78 }}
          style={{ maxWidth:500,fontSize:17,lineHeight:1.7,color:"rgba(255,255,255,0.45)",marginBottom:48,position:"relative",zIndex:2 }}>
          Le premier réseau social pensé pour les{" "}
          <strong style={{ color:"#fff" }}>otakus ivoiriens</strong>.
          Rejoins la bêta, sois parmi les fondateurs.
        </motion.p>

        {/* Buttons */}
        <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:.6,delay:.9 }}
          style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",position:"relative",zIndex:2 }}>
          <motion.button whileHover={{ y:-2,boxShadow:"0 8px 28px rgba(255,107,26,0.35)" }} whileTap={{ scale:.97 }}
            onClick={() => scrollTo("features")}
            style={{ background:"#FF6B1A",border:"none",borderRadius:13,padding:"15px 34px",fontWeight:800,fontSize:15,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
            <Swords size={16} /> Rejoindre la bêta 🎌
          </motion.button>
          <motion.button whileHover={{ borderColor:"#FF6B1A",color:"#FF6B1A",background:"rgba(255,107,26,0.08)" }} whileTap={{ scale:.97 }}
            onClick={() => scrollTo("about")}
            style={{ background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:13,padding:"15px 28px",fontWeight:700,fontSize:15,color:"rgba(255,255,255,0.55)",cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"all .2s" }}>
            <span style={{ width:22,height:22,borderRadius:"50%",border:"1.5px solid currentColor",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <Play size={8} fill="currentColor" style={{ marginLeft:2 }} />
            </span>
            Voir l&apos;app
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
          style={{ position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:5,zIndex:2 }}>
          <span style={{ fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:2.5,textTransform:"uppercase" }}>Scroll</span>
          <motion.div animate={{ scaleY:[1,.4,1],opacity:[1,.3,1] }} transition={{ duration:2,repeat:Infinity }}
            style={{ width:1,height:36,background:"linear-gradient(to bottom,#FF6B1A,transparent)" }} />
          <ChevronDown size={12} color="rgba(255,255,255,0.3)" />
        </motion.div>
      </section>

      <Marquee />
    </>
  );
}