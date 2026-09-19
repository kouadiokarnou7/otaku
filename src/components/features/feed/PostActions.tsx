// src/features/feed/components/PostActions.tsx
"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { toast } from "sonner";

interface PostActionsProps {
  post: Post;
  onLike?: () => void;
  onCommentToggle?: () => void;
  isCommentsOpen?: boolean;
}

// Boutons fantômes : pas de bordure au repos, la couleur n'apparaît
// qu'au survol. C'est ce qui garde la barre d'actions discrète sous
// le contenu, qui reste l'élément principal de la carte.
const ACTION =
  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:text-white";

export default function PostActions({ post, onLike, onCommentToggle, isCommentsOpen }: PostActionsProps) {
  const handleShare = async () => {
    const postUrl = typeof window !== "undefined" ? `${window.location.origin}/feed#post-${post.id}` : "";
    const author = post.username?.trim() || "un otaku";
    const shareText = `Découvre ce post de ${author} sur Nekama 🎌 :\n"${post.content?.slice(0, 120)}${post.content && post.content.length > 120 ? "..." : ""}"`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Nekama — Post de ${author}`,
          text: shareText,
          url: postUrl || window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Erreur partage natif:", err);
        }
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(postUrl || window.location.href);
        toast.success("Lien copié dans le presse-papier !", {
          description: "Tu peux maintenant le coller sur WhatsApp ou ailleurs 🎌",
        });
      } catch {
        toast.error("Impossible de copier le lien");
      }
    }
  };

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
          onClick={onCommentToggle}
          aria-label="Commenter"
          className={cn(
            ACTION, 
            "hover:bg-primary/10 hover:text-primary",
            isCommentsOpen && "bg-primary/10 text-primary"
          )}
        >
          <MessageCircle size={18} />
          <span className="tabular-nums font-bold">{post.stats.comments}</span>
        </motion.button>

        {/* Partager (WhatsApp, Telegram, X, Copie lien) */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleShare}
          aria-label="Partager ce post"
          title="Partager sur WhatsApp, X ou copier le lien"
          className={cn(ACTION, "hover:bg-primary/10 hover:text-primary")}
        >
          <Share2 size={17} />
          <span className="hidden xs:inline text-[11px] font-medium">Partager</span>
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
