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

export default function PostActions({ post, onLike }: PostActionsProps) {
  const actionClass = "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium";
  
  return (
    <div className="flex items-center justify-between gap-2">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={onLike}
        className={cn(
          actionClass,
          post.likedByUser 
            ? "text-red-400 bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20" 
            : "text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
        )}
      >
        <Heart 
          size={18} 
          fill={post.likedByUser ? "currentColor" : "none"} 
        />
        <span>{post.stats.likes}</span>
      </motion.button>

      {/* Comment */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          actionClass,
          "text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20"
        )}
      >
        <MessageCircle size={18} />
        <span>{post.stats.comments}</span>
      </motion.button>

      {/* Share */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          actionClass,
          "text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
        )}
      >
        <Repeat2 size={18} />
        <span className="hidden sm:inline">Partager</span>
      </motion.button>

      {/* Save */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          actionClass,
          "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20"
        )}
      >
        <Bookmark size={18} />
        <span className="hidden sm:inline">Marquer</span>
      </motion.button>
    </div>
  );
}