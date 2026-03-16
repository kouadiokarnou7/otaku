"use client";

import { motion } from "framer-motion";
import { PlusSquare, Image, Smile } from "lucide-react";
import Link from "next/link";

export default function CreatePostBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background:   "rgba(255,255,255,0.03)",
        border:       "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding:      "14px 16px",
        marginBottom: 12,
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>

        {/* Avatar placeholder */}
        <div style={{
          width:          38,
          height:         38,
          borderRadius:   "50%",
          background:     "linear-gradient(135deg,#FF6B1A,#C0392B)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       13,
          fontWeight:     700,
          color:          "#fff",
          flexShrink:     0,
        }}>
          Moi
        </div>

        {/* Faux input → redirige vers /post/new */}
        <Link href="/post/new" style={{ flex:1, textDecoration:"none" }}>
          <motion.div
            whileHover={{ borderColor:"rgba(255,107,26,0.4)", background:"rgba(255,107,26,0.04)" }}
            style={{
              padding:      "10px 14px",
              borderRadius: 10,
              border:       "1px solid rgba(255,255,255,0.08)",
              background:   "rgba(255,255,255,0.03)",
              fontSize:     13,
              color:        "rgba(255,255,255,0.3)",
              cursor:       "text",
              transition:   "all .2s",
              userSelect:   "none",
            }}
          >
            Quoi de neuf, Nakama ? 🎌
          </motion.div>
        </Link>
      </div>

      {/* Actions rapides */}
      <div style={{ display:"flex", gap:6, marginTop:10, paddingLeft:50 }}>
        <Link href="/post/new" style={{ textDecoration:"none" }}>
          <motion.button
            whileHover={{ background:"rgba(255,107,26,0.1)", borderColor:"rgba(255,107,26,0.3)", color:"#FF6B1A" }}
            whileTap={{ scale:0.95 }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          5,
              padding:      "5px 12px",
              borderRadius: 8,
              border:       "1px solid rgba(255,255,255,0.08)",
              background:   "transparent",
              color:        "rgba(255,255,255,0.4)",
              fontSize:     12,
              fontWeight:   600,
              cursor:       "pointer",
              transition:   "all .2s",
            }}
          >
            <PlusSquare size={13} /> Post
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ background:"rgba(0,212,255,0.08)", borderColor:"rgba(0,212,255,0.25)", color:"#00D4FF" }}
          whileTap={{ scale:0.95 }}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        5,
            padding:    "5px 12px",
            borderRadius:8,
            border:     "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            color:      "rgba(255,255,255,0.4)",
            fontSize:   12,
            fontWeight: 600,
            cursor:     "pointer",
            transition: "all .2s",
          }}
        >
          <Image size={13} /> Photo
        </motion.button>

        <motion.button
          whileHover={{ background:"rgba(243,156,18,0.08)", borderColor:"rgba(243,156,18,0.25)", color:"#F39C12" }}
          whileTap={{ scale:0.95 }}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        5,
            padding:    "5px 12px",
            borderRadius:8,
            border:     "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
            color:      "rgba(255,255,255,0.4)",
            fontSize:   12,
            fontWeight: 600,
            cursor:     "pointer",
            transition: "all .2s",
          }}
        >
          <Smile size={13} /> Humeur
        </motion.button>
      </div>
    </motion.div>
  );
}