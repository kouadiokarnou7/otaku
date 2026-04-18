"use client";

import { motion } from "framer-motion";
import type { Post } from "@/lib/types";
import Image from "next/image";

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative bg-gradient-to-br from-[#0a0e27] via-[#0f1430] to-[#1a1f3a] border border-orange-500/20 rounded-2xl overflow-hidden shadow-lg shadow-orange-500/5 hover:border-orange-500/40 hover:shadow-orange-500/20 transition-all duration-300"
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header — padding horizontal et vertical renforcés */}
      <div className="relative z-10 flex items-center gap-4 px-5 pt-5 pb-2">
        <div className="relative flex-shrink-0">
          <Image
            src={post.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username || 'User')}&background=random&size=40`}
            alt={post.username}
            className="w-11 h-11 rounded-full border-2 border-orange-500/40 flex-shrink-0 ring-2 ring-orange-500/10"
            width={44}
            height={44}
            priority
          />
          {post.userLevel && (
            <div className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 rounded-full text-white text-xs font-bold border border-orange-300">
              {post.userLevel}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm hover:text-orange-400 transition-colors cursor-pointer">
              {post.username}
            </span>
            {post.userBadge && (
              <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full text-orange-300 border border-orange-500/30 font-medium">
                {post.userBadge}
              </span>
            )}
          </div>
          <time className="text-xs text-gray-400 mt-0.5 block">
            {timeAgo(post.metadata.createdAt)}
          </time>
        </div>
      </div>

      {/* Contenu — espace généreux au-dessus et en dessous */}
      {post.content && (
        <div className="relative z-10 px-5 pt-3 pb-4">
          <p className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Media — marge interne pour ne pas coller aux bords */}
      {post.media?.url && (
        <div className="relative z-10 px-5 pb-4">
          <div className="rounded-xl overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-orange-500/10">
            <Image
              src={post.media.url}
              alt="Post media"
              className="w-full max-h-64 sm:max-h-96 object-cover hover:scale-105 transition-transform duration-300"
              width={800}
              height={800}
              priority
            />
          </div>
        </div>
      )}

      {/* Separator */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      
      {/* Actions — séparé par un peu d'espace */}
      <div className="relative z-10 px-4 pt-3 pb-4">
        <PostActions post={post} onLike={() => onLike?.(post.id)} />
      </div>
    </motion.article>
  );
}