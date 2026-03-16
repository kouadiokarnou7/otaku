"use client";

import { Swords } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", background:"#050508", padding:"40px 24px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* Ligne principale */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20, marginBottom:32 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
            onClick={() => window.scrollTo({top:0, behavior:"smooth"})}>
            <Swords size={22} color="#FF6B1A" />
            <span style={{ fontSize:17, fontWeight:900, color:"#fff", letterSpacing:1 }}>
              OTAKU <span style={{ color:"#FF6B1A" }}>225</span>
            </span>
          </div>

          {/* Liens nav */}
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {[
              { label:"Fonctionnalités", href:"#features" },
              { label:"À Propos",        href:"#about"    },
              { label:"Galerie",         href:"#gallery"  },
              { label:"Contact",         href:"#"         },
            ].map((link) => (
              <a key={link.label} href={link.href}
                style={{ fontSize:13, color:"rgba(255,255,255,0.4)", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#FF6B1A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Réseaux */}
          <div style={{ display:"flex", gap:8 }}>
            {[
              { emoji:"🎵", label:"TikTok"    },
              { emoji:"📸", label:"Instagram" },
              { emoji:"💬", label:"Discord"   },
              { emoji:"📱", label:"WhatsApp"  },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label}
                style={{ width:34, height:34, borderRadius:8, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, textDecoration:"none", transition:"border-color .2s, background .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,26,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,107,26,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {s.emoji}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.05)", marginBottom:20 }} />

        {/* Copyright */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.2)", margin:0 }}>
            © {year} Otaku 225. Fait avec ❤️ à Abidjan 🇨🇮
          </p>
          <div style={{ display:"flex", gap:16 }}>
            {["CGU", "Confidentialité", "Cookies"].map((label) => (
              <a key={label} href="#"
                style={{ fontSize:11, color:"rgba(255,255,255,0.2)", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}