"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  CornerDownRight,
  CheckCheck,
  Trash2,
  Sparkles,
  ArrowLeft,
  Flame,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useNotifications } from "@/lib/hooks/store/useNotifications";
import type { AppNotification } from "@/lib/types";

type TabFilter = "all" | "unread" | "interactions";

function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return "À l'instant";
  if (sec < 3600) return `Il y a ${Math.floor(sec / 60)} min`;
  if (sec < 86_400) return `Il y a ${Math.floor(sec / 3600)} h`;
  if (sec < 604_800) return `Il y a ${Math.floor(sec / 86_400)} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(user?.uid);

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const router = useRouter();

  // Filtrage selon l'onglet actif
  const filteredNotifs = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "interactions") {
      return notif.type === "like_post" || notif.type === "comment_post" || notif.type === "reply_comment";
    }
    return true;
  });

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    // Redirection vers le flux ou le post
    router.push("/feed");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 text-primary">
          <Bell size={28} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connecte-toi pour voir tes alertes</h2>
        <p className="text-xs text-muted-foreground mb-6">
          Reçois en direct les likes, commentaires et réponses d&apos;autres otakus sur tes publications !
        </p>
        <Link
          href="/login"
          className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/25 hover:brightness-110 transition-all no-underline"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 pb-28 text-foreground">
      {/* ── En-tête : Titre + Badge non-lus + Bouton tout marquer comme lu ── */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-violet-600/30 via-primary/20 to-indigo-600/20 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
              <Bell size={18} />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white shadow-sm ring-2 ring-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                  {unreadCount} {unreadCount > 1 ? "nouvelles" : "nouvelle"}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Interactions communautaires en temps réel
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card/70 hover:bg-card text-xs font-semibold text-muted-foreground hover:text-white transition-all shadow-sm"
            title="Marquer toutes les notifications comme lues"
          >
            <CheckCheck size={14} className="text-primary" />
            <span className="hidden sm:inline text-[11px]">Tout lire</span>
          </button>
        )}
      </div>

      {/* ── Filtres par onglets ── */}
      <div className="flex items-center gap-1.5 mb-4 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-primary text-white shadow-sm shadow-violet-500/25"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "unread"
              ? "bg-primary text-white shadow-sm shadow-violet-500/25"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          <span>Non lues</span>
          {unreadCount > 0 && (
            <span
              className={`size-2 rounded-full ${
                activeTab === "unread" ? "bg-white" : "bg-[#EF4444]"
              }`}
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("interactions")}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "interactions"
              ? "bg-primary text-white shadow-sm shadow-violet-500/25"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Interactions
        </button>
      </div>

      {/* ── Liste des Notifications ── */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
          <span>Chargement de tes alertes…</span>
        </div>
      ) : filteredNotifs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-dashed border-border/70 p-10 text-center bg-card/30 backdrop-blur-sm"
        >
          <div className="size-14 mx-auto mb-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles size={24} />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {activeTab === "unread"
              ? "Toutes tes alertes sont lues ! ✨"
              : "Aucune notification pour le moment 🎌"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-5 leading-relaxed">
            {activeTab === "unread"
              ? "Tu es à jour sur toutes les interactions de ta communauté."
              : "Partage un avis d'anime ou lance un sondage dans le feed pour interagir avec les autres otakus !"}
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary/20 hover:bg-primary/30 border border-primary/30 px-5 py-2 text-xs font-bold text-primary transition-all no-underline"
          >
            <Flame size={14} />
            <span>Explorer le fil d&apos;actualité</span>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filteredNotifs.map((notif) => {
              const isLike = notif.type === "like_post";
              const isComment = notif.type === "comment_post";
              const isReply = notif.type === "reply_comment";

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className={`group relative flex items-start gap-3 rounded-2xl border p-3 sm:p-3.5 transition-all backdrop-blur-sm cursor-pointer ${
                    !notif.read
                      ? "bg-primary/10 border-primary/40 shadow-sm shadow-primary/10"
                      : "bg-card/70 border-border/70 hover:border-primary/30"
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {/* Avatar avec pastille d'action flottante */}
                  <div className="relative shrink-0">
                    <div className="size-11 rounded-full overflow-hidden border border-border/80 bg-muted">
                      <Image
                        src={
                          notif.fromPhotoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            notif.fromUsername
                          )}&background=8B5CF6&color=fff&size=80`
                        }
                        alt={notif.fromUsername}
                        width={44}
                        height={44}
                        className="size-full object-cover"
                      />
                    </div>

                    {/* Icône du type d'interaction */}
                    <div
                      className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-background ${
                        isLike
                          ? "bg-rose-500"
                          : isComment
                          ? "bg-primary"
                          : "bg-cyan-500"
                      }`}
                    >
                      {isLike && <Heart size={10} className="fill-white" />}
                      {isComment && <MessageCircle size={10} />}
                      {isReply && <CornerDownRight size={10} />}
                    </div>
                  </div>

                  {/* Corps de la notification */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-foreground mb-0.5">
                      <strong className="font-bold text-white hover:text-primary transition-colors">
                        {notif.fromUsername}
                      </strong>
                      <span className="text-muted-foreground text-[12px]">
                        {isLike && "a aimé ta publication"}
                        {isComment && "a commenté ton post"}
                        {isReply && "a répondu à ton commentaire"}
                      </span>
                    </div>

                    {/* Extrait du commentaire si existant */}
                    {notif.contentPreview && (
                      <div className="mt-1 rounded-xl bg-background/50 border border-border/50 px-2.5 py-1.5 text-xs text-foreground/85 italic truncate">
                        « {notif.contentPreview} »
                      </div>
                    )}

                    {/* Horodatage + statut */}
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock size={11} />
                      <span>{timeAgo(notif.createdAt)}</span>
                      {!notif.read && (
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Action de suppression */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Supprimer la notification"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 p-1.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
