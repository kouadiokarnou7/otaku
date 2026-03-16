"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import PostCard from "./Postcard";
import type { Post, FeedFilter } from "./Types";

interface PostListProps {
  posts:  Post[];
  filter: FeedFilter;
}

export default function PostList({ posts, filter }: PostListProps) {
  const [items, setItems] = useState<Post[]>(posts);

  // ── Toggle like ─────────────────────────────────────────────
  const handleLike = (id: string) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  // ── Toggle save ─────────────────────────────────────────────
  const handleSave = (id: string) => {
    setItems((prev) =>
      prev.map((p) => p.id === id ? { ...p, saved: !p.saved } : p)
    );
  };

  // ── Etat vide (onglet Abonnements sans follows) ──────────────
  if (filter === "following" && items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign:"center", padding:"48px 16px" }}
      >
        <div style={{ fontSize:40, marginBottom:12 }}>🎌</div>
        <p style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:6 }}>
          Tu ne suis encore personne
        </p>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", lineHeight:1.6 }}>
          Explore la communauté et abonne-toi à des otakus pour voir leurs posts ici.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Label "Pour toi" */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        <Flame size={14} color="#FF6B1A" />
        <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          {filter === "all" ? "Pour toi" : "Abonnements"}
        </span>
      </div>

      {/* Posts */}
      {items.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <PostCard
            post={post}
            onLike={handleLike}
            onSave={handleSave}
          />
        </motion.div>
      ))}

      {/* Fin du feed */}
      <div style={{ textAlign:"center", padding:"24px 0 8px" }}>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.2)" }}>
          Tu as tout vu pour l&apos;instant 🎌
        </p>
      </div>
    </div>
  );
}