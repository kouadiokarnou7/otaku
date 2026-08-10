
"use client";

import type { Post } from "@/lib/types";
import { motion } from "framer-motion";

import PostCard from "./Postcard";

interface FeedListProps {
  posts: Post[];
  onLike?: (postId: string) => void;
  emptyMessage?: string;
}

export default function FeedList({ 
  posts, 
  onLike,
  emptyMessage = "Aucun post pour le moment 🎮" 
}: FeedListProps) {
  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4"
      >
        <div className="inline-block rounded-2xl border border-orange-500/20 bg-orange-500/5 px-8 py-8">
          <p className="text-gray-400 text-lg font-medium whitespace-pre-line">{emptyMessage}</p>
          <p className="text-gray-500 text-sm mt-3">Reviens bientôt pour découvrir de nouveaux posts ! 🚀</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col gap-4 pd-x-4 pd-y-6 pd-sm-x-6 pd-sm-y-8w"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard 
            post={post} 
            onLike={onLike} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}