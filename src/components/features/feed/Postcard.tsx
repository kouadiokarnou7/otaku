"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import Image from "next/image";
import PostActions from "@/components/features/feed/PostActions";
import PostPollWidget from "@/components/features/feed/PostPollWidget";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

/**
 * Formate une date en libellé relatif court ("Il y a 3h").
 * Au-delà d'une semaine on bascule sur la date absolue : « Il y a 42j »
 * ne dit plus rien d'utile au lecteur.
 */
function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "À l'instant";
  if (sec < 3600) return `Il y a ${Math.floor(sec / 60)} min`;
  if (sec < 86_400) return `Il y a ${Math.floor(sec / 3600)} h`;
  if (sec < 604_800) return `Il y a ${Math.floor(sec / 86_400)} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const createdAt = post.metadata.createdAt;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 backdrop-blur-sm transition-all hover:border-primary/30 shadow-lg shadow-black/20"
    >
      {/* ── En-tête : auteur + horodatage ── */}
      <header className="flex items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="relative shrink-0">
          <Image
            src={
              post.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.username || "User"
              )}&background=random&size=80`
            }
            alt={post.username}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          {/* Pastille de niveau, ancrée sur l'avatar */}
          {post.userLevel && (
            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-brand text-[10px] font-bold text-primary-foreground">
              {post.userLevel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href="/profile"
              className="truncate text-sm font-semibold text-foreground transition-colors hover:text-brand"
            >
              {post.username}
            </Link>
            {post.userBadge && (
              <span className="rounded-full bg-brand-dim px-2 py-0.5 text-[11px] font-semibold text-brand">
                {post.userBadge}
              </span>
            )}
          </div>
          <time
            dateTime={createdAt.toISOString()}
            className="text-xs text-muted-foreground"
          >
            {timeAgo(createdAt)}
          </time>
        </div>
      </header>

      {/* ── Contenu texte ── */}
      {post.content && (
        <div className="px-4 pt-3 sm:px-5">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground/90">
            {post.content}
          </p>
        </div>
      )}

      {/* ── Sondage interactif (si présent) ── */}
      {post.poll && (
        <div className="px-4 pt-3 sm:px-5">
          <PostPollWidget poll={post.poll} />
        </div>
      )}

      {/* ── Média ── */}
      {post.media?.url && (
        <div className="px-4 pt-3 sm:px-5">
          <div className="overflow-hidden rounded-xl border border-border">
            <Image
              src={post.media.url}
              alt=""
              width={1200}
              height={1200}
              sizes="(max-width: 640px) 100vw, 680px"
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <footer className="mt-4 border-t border-border px-2 py-1 sm:px-3">
        <PostActions post={post} onLike={() => onLike?.(post.id)} />
      </footer>
    </motion.article>
  );
}
