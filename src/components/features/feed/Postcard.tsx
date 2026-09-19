"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/lib/types";
import Image from "next/image";
import PostActions from "@/components/features/feed/PostActions";
import PostPollWidget from "@/components/features/feed/PostPollWidget";
import { usePostComments } from "@/lib/hooks/store/usePost";
import {
  Send,
  Loader2,
  MessageSquare,
  Trash2,
  CornerDownRight,
  X,
  AlertCircle,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  currentUserUid?: string;
  isAdmin?: boolean;
  onLike?: (postId: string, postAuthorUid?: string) => void;
  onComment?: (
    postId: string,
    content: string,
    options?: { postAuthorUid?: string; parentId?: string | null; replyToUsername?: string; parentAuthorUid?: string }
  ) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
}

interface ReplyingToState {
  commentId: string;
  username: string;
  uid: string;
}

/**
 * Formate une date en libellé relatif court ("Il y a 3h").
 */
function timeAgo(date: Date | any): string {
  const d = date instanceof Date ? date : date?.toDate ? date.toDate() : new Date();
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "À l'instant";
  if (sec < 3600) return `Il y a ${Math.floor(sec / 60)} min`;
  if (sec < 86_400) return `Il y a ${Math.floor(sec / 3600)} h`;
  if (sec < 604_800) return `Il y a ${Math.floor(sec / 86_400)} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function PostCard({
  post,
  currentUserUid,
  isAdmin,
  onLike,
  onComment,
  onDelete,
}: PostCardProps) {
  const createdAt = post.metadata?.createdAt instanceof Date
    ? post.metadata.createdAt
    : new Date();
  const authorName = post.username?.trim() || "Otaku";
  const isAuthor = !!currentUserUid && currentUserUid === post.uid;
  const canDelete = (isAuthor || !!isAdmin) && !!onDelete;

  // Gestion interactive des commentaires et réponses
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyingToState | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Écouteur réel des commentaires Firestore lorsque le tiroir est ouvert
  const { comments, loading: loadingComments } = usePostComments(
    isCommentsOpen ? post.id : undefined
  );

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const textToSend = commentInput.trim();
    setCommentInput("");

    try {
      if (onComment) {
        await onComment(post.id, textToSend, {
          postAuthorUid: post.uid,
          parentId: replyingTo ? replyingTo.commentId : null,
          replyToUsername: replyingTo ? replyingTo.username : undefined,
          parentAuthorUid: replyingTo ? replyingTo.uid : undefined,
        });
      }
      setReplyingTo(null);
      toast.success("Commentaire publié !");
    } catch (err) {
      console.error("Erreur envoi commentaire:", err);
      toast.error("Impossible d'envoyer le commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(post.id);
      toast.success("Publication supprimée");
    } catch (err) {
      console.error("Erreur suppression post:", err);
      toast.error("Erreur lors de la suppression du post");
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  // Séparation commentaires racines vs réponses
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 backdrop-blur-sm transition-all hover:border-primary/30 shadow-lg shadow-black/20"
    >
      {/* ── En-tête : auteur + horodatage + bouton supprimer si propriétaire ── */}
      <header className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <Image
              src={
                post.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  authorName
                )}&background=8B5CF6&color=fff&size=80`
              }
              alt={authorName}
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href="/profile"
                className="truncate text-sm font-bold text-foreground transition-colors hover:text-primary no-underline"
              >
                {authorName}
              </Link>
              {post.userBadge && (
                <span className="rounded-full bg-primary/15 border border-primary/25 px-2 py-0.5 text-[11px] font-semibold text-primary">
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
        </div>

        {/* Action de suppression pour l'auteur ou modération par l'administrateur */}
        {canDelete && (
          <div className="relative shrink-0">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-xl px-2 py-1">
                <span className="text-[11px] font-bold text-red-400">
                  {isAuthor ? "Supprimer ?" : "Modérer (Admin) ?"}
                </span>
                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? <Loader2 size={11} className="animate-spin" /> : "Oui"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="rounded-lg p-0.5 text-muted-foreground hover:text-white transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                title={isAuthor ? "Supprimer cette publication" : "Modérer cette publication (Admin)"}
                className={`flex size-8 items-center justify-center rounded-xl transition-colors ${!isAuthor && isAdmin
                    ? "text-amber-400/80 hover:bg-amber-500/20 hover:text-amber-300"
                    : "text-muted-foreground hover:bg-red-500/15 hover:text-red-400"
                  }`}
              >
                {!isAuthor && isAdmin ? <Shield size={15} /> : <Trash2 size={15} />}
              </button>
            )}
          </div>
        )}
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
      <footer className="mt-4 border-t border-border/70 px-2 py-1 sm:px-3">
        <PostActions
          post={post}
          onLike={() => onLike?.(post.id, post.uid)}
          onCommentToggle={() => setIsCommentsOpen((prev) => !prev)}
          isCommentsOpen={isCommentsOpen}
        />

        {/* ── Espace de commentaires déroulant en temps réel ── */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              key="comments-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/50 pt-3 pb-2 px-2 space-y-3"
            >
              {/* Indicateur de réponse active */}
              {replyingTo && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl px-3 py-1.5 text-xs text-primary">
                  <div className="flex items-center gap-1.5">
                    <CornerDownRight size={13} />
                    <span>En réponse à <strong>@{replyingTo.username}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Formulaire pour ajouter un commentaire ou une réponse */}
              <form onSubmit={handleSendComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={
                    replyingTo
                      ? `Répondre à @${replyingTo.username}...`
                      : "Écrire un commentaire..."
                  }
                  className="flex-1 rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim() || isSubmitting}
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Envoyer"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>

              {/* Liste des commentaires réels depuis Firestore */}
              {loadingComments ? (
                <div className="py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span>Chargement des commentaires…</span>
                </div>
              ) : rootComments.length > 0 ? (
                <div className="space-y-2.5 pt-1 max-h-72 overflow-y-auto pr-1">
                  {rootComments.map((comm) => {
                    const replies = getReplies(comm.id);

                    return (
                      <div key={comm.id} className="space-y-1.5">
                        {/* Commentaire principal */}
                        <div className="flex items-start gap-2.5 rounded-xl bg-background/50 p-2.5 border border-border/40 text-xs">
                          <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                            {comm.userAvatar ? (
                              <Image
                                src={comm.userAvatar}
                                alt={comm.username}
                                width={24}
                                height={24}
                                className="size-full object-cover"
                              />
                            ) : (
                              comm.username[0]?.toUpperCase() || "O"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-white text-[11px] truncate">
                                {comm.username}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {timeAgo(comm.createdAt)}
                              </span>
                            </div>
                            <p className="text-foreground/90 text-[12px] break-words">
                              {comm.content}
                            </p>
                            {/* Bouton Répondre */}
                            <div className="mt-1 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyingTo({
                                    commentId: comm.id,
                                    username: comm.username,
                                    uid: comm.uid,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                              >
                                <CornerDownRight size={11} />
                                <span>Répondre</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Réponses en cascade sous ce commentaire */}
                        {replies.length > 0 && (
                          <div className="ml-6 border-l-2 border-primary/30 pl-3 space-y-1.5">
                            {replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2 rounded-xl bg-background/30 p-2 border border-border/30 text-xs"
                              >
                                <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0 overflow-hidden">
                                  {reply.userAvatar ? (
                                    <Image
                                      src={reply.userAvatar}
                                      alt={reply.username}
                                      width={20}
                                      height={20}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    reply.username[0]?.toUpperCase() || "O"
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-bold text-white text-[11px] truncate">
                                      {reply.username}
                                      {reply.replyToUsername && (
                                        <span className="text-primary font-normal text-[10px] ml-1">
                                          @{reply.replyToUsername}
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">
                                      {timeAgo(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-foreground/90 text-[11px] break-words">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2 text-center text-muted-foreground text-[11px] flex items-center justify-center gap-1.5 opacity-70">
                  <MessageSquare size={13} />
                  <span>Soyez le premier à commenter !</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </motion.article>
  );
}
