"use client";

import { motion } from "framer-motion";
import type { Post } from "@/lib/types";

import PostActions from "@/components/features/feed/PostActions";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const timeAgo = (date: Date) => {
    const sec = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (sec < 60) return "À l'instant";
    if (sec < 3600) return `Il y a ${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `Il y a ${Math.floor(sec / 3600)}h`;
    return `Il y a ${Math.floor(sec / 86400)}j`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f1430] border border-[#1e2540] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.userAvatar || "/avatar-placeholder.png"}
          alt={post.username}
          className="w-10 h-10 rounded-full border border-[#2D3748] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">
              {post.username}
            </span>
            {post.userBadge && (
              <span className="text-xs px-2 py-0.5 bg-[#1a2040] rounded-full text-orange-400 border border-[#2D3748]">
                {post.userBadge}
              </span>
            )}
          </div>
          <time className="text-xs text-gray-500">
            {timeAgo(post.metadata.createdAt)}
          </time>
        </div>
      </div>

      {/* Contenu */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media */}
      {post.media?.url && (
        <div className="px-4 pb-3">
          <img
            src={post.media.url}
            alt="Post media"
            className="w-full rounded-xl border border-[#2D3748] max-h-64 sm:max-h-96 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <PostActions post={post} onLike={() => onLike?.(post.id)} />
    </motion.article>
  );
}