// src/features/feed/components/PostActions.tsx
"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";

interface PostActionsProps {
  post: Post;
  onLike?: () => void;
}

// Boutons fantômes : pas de bordure au repos, la couleur n'apparaît
// qu'au survol. C'est ce qui garde la barre d'actions discrète sous
// le contenu, qui reste l'élément principal de la carte.
const ACTION =
  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:text-white";

export default function PostActions({ post, onLike }: PostActionsProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onLike}
          aria-pressed={post.likedByUser}
          aria-label={post.likedByUser ? "Retirer le like" : "Aimer ce post"}
          className={cn(
            ACTION,
            "hover:bg-[#EF4444]/10 hover:text-[#EF4444]",
            post.likedByUser && "text-[#EF4444]"
          )}
        >
          <Heart
            size={18}
            className={post.likedByUser ? "fill-[#EF4444] text-[#EF4444]" : ""}
          />
          <span className="tabular-nums font-bold">{post.stats.likes}</span>
        </motion.button>

        {/* Commentaires */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          aria-label="Commenter"
          className={cn(ACTION, "hover:bg-primary/10 hover:text-primary")}
        >
          <MessageCircle size={18} />
          <span className="tabular-nums font-bold">{post.stats.comments}</span>
        </motion.button>

        {/* Partager */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          aria-label="Partager"
          className={cn(ACTION, "hover:bg-white/10 hover:text-white")}
        >
          <Repeat2 size={18} />
        </motion.button>
      </div>

      {/* Sauvegarde */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        aria-label="Enregistrer"
        className={cn(ACTION, "hover:bg-primary/10 hover:text-primary")}
      >
        <Bookmark size={18} />
      </motion.button>
    </div>
  );
}
