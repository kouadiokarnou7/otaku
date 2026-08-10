"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import Image from "next/image";
import PostActions from "@/components/features/feed/PostActions";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  /** Hauteur maximale du card avant scroll interne (par défaut: 90vh pour mobile-first) */
  maxHeight?: string;
}

export default function PostCard({ 
  post, 
  onLike, 
  maxHeight = "min(90vh, 1200px)" 
}: PostCardProps) {
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
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-[#0a0e27] via-[#0f1430] to-[#1a1f3a] border border-orange-500/20 rounded-3xl overflow-hidden shadow-xl shadow-orange-500/10 hover:border-orange-500/50 hover:shadow-orange-500/25 transition-all duration-300"
      style={{ maxHeight }}
    >
      {/* Container scrollable avec gestion technique du overflow */}
      <div className="flex flex-col h-full max-h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent hover:scrollbar-thumb-orange-500/50 transition-scrollbar">
        
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Header — padding généreux et espacement large */}
        <header className="relative z-10 flex items-start gap-6 px-8 pt-8 pb-6">
          <div className="relative flex-shrink-0">
            <Image
              src={post.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username || 'User')}&background=random&size=72`}
              alt={post.username}
              className="w-16 h-16 rounded-full border-2 border-orange-500/50 flex-shrink-0 ring-4 ring-orange-500/15 object-cover"
              width={72}
              height={72}
              priority
            />
            {post.userLevel && (
              <div className="absolute -bottom-1 -right-1 h-7 w-7 flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 rounded-full text-white text-[11px] font-bold border-2 border-[#0a0e27] shadow-lg shadow-orange-500/30">
                {post.userLevel}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Link 
                href="/profile" 
                className="font-bold text-white text-lg hover:text-orange-400 transition-colors cursor-pointer break-words"
              >
                {post.username}
              </Link>
              {post.userBadge && (
                <span className="text-xs px-4 py-2 bg-gradient-to-r from-orange-500/25 to-orange-600/25 rounded-full text-orange-300 border border-orange-500/40 font-semibold whitespace-nowrap">
                  {post.userBadge}
                </span>
              )}
            </div>
            <time className="text-base text-gray-400 mt-2 block">
              {timeAgo(post.metadata.createdAt)}
            </time>
          </div>
        </header>

        {/* Contenu — typographie confortable et padding large */}
        {post.content && (
          <section className="relative z-10 px-8 pt-3 pb-6">
            <p className="text-gray-100 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </section>
        )}

        {/* Media — conteneur responsive avec ratio et scroll safe */}
        {post.media?.url && (
          <section className="relative z-10 px-8 pb-6">
            <div className="rounded-2xl overflow-hidden border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 shadow-xl shadow-orange-500/15 bg-[#05070d]">
              <Image
                src={post.media.url}
                alt="Post media"
                className="w-full max-h-96 sm:max-h-[520px] object-contain sm:object-cover hover:scale-105 transition-transform duration-500"
                width={1200}
                height={1200}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
              />
            </div>
          </section>
        )}

        {/* Separator — espacement vertical généreux */}
        <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mx-8 my-2" />
        
        {/* Actions — zone dédiée avec padding confortable */}
        <footer className="relative z-10 px-8 pt-5 pb-8 mt-auto">
          <PostActions post={post} onLike={() => onLike?.(post.id)} />
        </footer>

      </div>

      {/* Styles personnalisés pour scrollbar (fallback sans plugin) */}
      <style>{`
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 107, 26, 0.3) transparent;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(255, 107, 26, 0.3);
          border-radius: 20px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 107, 26, 0.5);
        }
        .transition-scrollbar {
          transition: scrollbar-color 0.2s ease;
        }
      `}</style>
    </motion.article>
  );
}