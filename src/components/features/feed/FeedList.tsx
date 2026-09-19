"use client";

import type { Post } from "@/lib/types";
import { motion } from "framer-motion";

import PostCard from "./Postcard";

interface FeedListProps {
  posts: Post[];
  currentUserUid?: string;
  isAdmin?: boolean;
  onLike?: (postId: string, postAuthorUid?: string) => void;
  onComment?: (
    postId: string, 
    content: string, 
    options?: { postAuthorUid?: string; parentId?: string | null; replyToUsername?: string; parentAuthorUid?: string }
  ) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
  emptyMessage?: string;
}

export default function FeedList({
  posts,
  currentUserUid,
  isAdmin,
  onLike,
  onComment,
  onDelete,
  emptyMessage = "Aucun post pour le moment 🎮",
}: FeedListProps) {
  // ── État vide ──
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-dashed border-border px-6 py-14 text-center"
      >
        <p className="whitespace-pre-line font-medium text-foreground">
          {emptyMessage}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Reviens bientôt pour découvrir de nouveaux posts 🚀
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          // L'escalier s'arrête au 6e post : au-delà, l'attente cumulée
          // se voit plus qu'elle n'apporte, surtout au scroll.
          transition={{ delay: Math.min(index, 6) * 0.05 }}
        >
          <PostCard
            post={post}
            currentUserUid={currentUserUid}
            isAdmin={isAdmin}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
}
