// src/features/feed/components/PostActions.tsx
"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";
import  Button  from "@/components/ui/button";

interface PostActionsProps {
  post: Post;
  onLike?: () => void;
}

export default function PostActions({ post, onLike }: PostActionsProps) {
  return (
    <div className="flex items-center justify-around px-4 py-3 border-t border-[#1e2540]">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onLike}
        className={cn(
          "flex items-center gap-1.5 text-sm transition-colors",
          post.likedByUser ? "text-red-400" : "text-gray-400 hover:text-red-400"
        )}
      >
        <Heart 
          size={18} 
          fill={post.likedByUser ? "currentColor" : "none"} 
        />
        <span>{post.stats.likes}</span>
      </motion.button>

      {/* Comment */}
      <Button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
        <MessageCircle size={18} />
        <span>{post.stats.comments}</span>
      </Button>

      {/* Share */}
      <Button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
        <Share2 size={18} />
        <span className="hidden sm:inline">Partager</span>
      </Button>
      {/* Save */}
      <Button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-400 transition-colors">
        <Bookmark size={18} />
        <span className="hidden sm:inline">Enregistrer</span>
       
      </Button>
    </div>
  );
}