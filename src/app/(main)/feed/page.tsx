"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { usePost } from "@/lib/hooks/store/usePost";
import { useProfile } from "@/lib/hooks/store/useProfile";
import PublishFAB from "@/components/main/PublishFAB";
import FeedList from "@/components/features/feed/FeedList";
import PostComposer from "@/components/features/feed/PostCompose";
import { RefreshCw, Image as ImageIcon, BarChart3, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { uploadAvatar } from "@/lib/firebase/storage";
import type { Post } from "@/lib/types";

// Post officiel épinglé contenant le sondage pour recueillir l'avis des utilisateurs sur l'application
const OFFICIAL_FEEDBACK_POLL_POST: Post = {
  id: "official-nekama-feedback-poll",
  uid: "nekama-official-team",
  username: "Nekama Team 🎌",
  photoURL: "https://ui-avatars.com/api/?name=Nekama+Team&background=8B5CF6&color=fff&size=120",
  userLevel: 99,
  userBadge: "Officiel",
  content: "Bienvenue sur la bêta de Nekama ! ✨ Votre avis est crucial pour nous aider à bâtir le meilleur réseau social des otakus. Répondez au sondage ci-dessous pour nous guider :",
  poll: {
    question: "Que pensez-vous de l'expérience et de l'application Nekama ?",
    options: [
      { id: "opt-1", text: "🔥 Incroyable, j'adore le style et l'ambiance !", votes: 54 },
      { id: "opt-2", text: "✨ Très prometteur, hâte de voir la suite !", votes: 36 },
      { id: "opt-3", text: "🛠️ Bien, mais il manque encore des options", votes: 12 },
      { id: "opt-4", text: "🐛 J'ai rencontré des bugs à signaler", votes: 5 },
    ],
    totalVotes: 107,
  },
  stats: {
    likes: 142,
    comments: 24,
    shares: 19,
  },
  metadata: {
    createdAt: new Date(),
    visibility: "public",
    tags: ["bêta", "feedback", "nekama"],
  },
};

/**
 * Page du fil d'actualité (Feed) d'Otaku225.
 * Affiche les posts de la communauté, permet de créer un nouveau post
 * et de liker/interagir avec le contenu.
 * Harmonisé avec le design system (Tailwind sémantique, couleur d'accent #FF3E00).
 *
 * @page
 * @returns {JSX.Element} La page de feed.
 */
export default function FeedPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile } = useProfile(user?.uid);
  const { posts, loading, error, createPost, fetchFeed, toggleLike } = usePost(user?.uid);
  
  const [showComposer, setShowComposer] = useState(false);

  // Rafraîchir le feed au montage
  useEffect(() => {
    if (user?.uid) {
      fetchFeed();
    }
  }, [user?.uid, fetchFeed]);

  /**
   * Gère la création d'un nouveau post.
   * Upload le média associé s'il y en a un, puis crée le document dans Firestore.
   *
   * @param {string} content - Le texte du post.
   * @param {string} [mediaUrl] - L'URL optionnelle du média attaché.
   */
  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    if (!user) return;
    
    try {
      let uploadedMediaUrl = mediaUrl;
      
      // Si un fichier média est fourni sous forme de base64, on l'upload
      if (mediaUrl && mediaUrl.startsWith('data:')) {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        const file = new File([blob], `post_${Date.now()}.jpg`, { type: 'image/jpeg' });
        uploadedMediaUrl = await uploadAvatar(user.uid, file);
      }

      await createPost(content, uploadedMediaUrl);
      await fetchFeed(); // Rafraîchir le feed
      setShowComposer(false);
    } catch (err) {
      console.error("❌ Erreur création post:", err);
    }
  };

  /**
   * Gère le like/unlike d'un post.
   *
   * @param {string} postId - L'ID du post à liker/unliker.
   */
  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  // État de chargement global
  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div
          className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
          role="status"
          aria-label="Chargement du feed"
        />
        <p className="text-sm text-muted-foreground font-medium">Chargement…</p>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-heading text-2xl font-bold tracking-tight text-white">
          Bienvenue sur Nekama 🎌
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Connecte-toi pour accéder au fil d'actualité, suivre tes animes et partager ta passion !
        </p>
        <Link
          href="/login"
          className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all no-underline"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-4 pb-24">
      {/* ── Bloc Publier (PC & Tablette uniquement) ── */}
      <div className="hidden sm:block rounded-2xl border border-border/80 bg-card/80 p-3.5 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 rounded-full overflow-hidden border border-primary/40 bg-primary/20">
            <Image
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.displayName || "Otaku"
                )}&background=8B5CF6&color=fff&size=80`
              }
              alt="Profil"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-xl border border-border/70 bg-background/60 text-xs text-muted-foreground hover:border-primary/40 hover:text-white transition-all shadow-inner"
          >
            Quoi de neuf, otaku ? Partage ton avis... 
          </button>
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all shrink-0"
          >
            Publier
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="flex items-center gap-1.5 hover:text-primary transition-colors text-muted-foreground"
            >
              <ImageIcon size={15} className="text-primary" />
              <span>Image</span>
            </button>
            <Link
              href="/post/new"
              className="flex items-center gap-1.5 hover:text-primary transition-colors no-underline text-muted-foreground"
            >
              <BarChart3 size={15} className="text-primary" />
              <span>Sondage</span>
            </Link>
            <Link
              href="/post/new"
              className="flex items-center gap-1.5 hover:text-primary transition-colors no-underline text-muted-foreground"
            >
              <Smile size={15} className="text-primary" />
              <span>Ressenti</span>
            </Link>
          </div>
          <button
            onClick={() => fetchFeed()}
            disabled={loading}
            aria-label="Rafraîchir le feed"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-primary" : ""} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* ── Rafraîchissement mobile discret ── */}
      <div className="flex sm:hidden items-center justify-between px-1">
        <h2 className="font-heading text-base font-extrabold text-white tracking-tight">Fil d'actualité</h2>
        <button
          onClick={() => fetchFeed()}
          disabled={loading}
          aria-label="Rafraîchir le feed"
          className="flex size-8 items-center justify-center rounded-xl bg-card/60 text-muted-foreground hover:text-white border border-border/70"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-primary" : ""} />
        </button>
      </div>

      {/* Message d'erreur si présent */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400"
        >
          {error}
        </div>
      )}

      {/* Composer modal — s'ouvre au clic sur le FAB */}
      {showComposer && user && (
        <PostComposer
          user={
            profile ?? {
              uid: user.uid,
              username: user.displayName || user.email || "Nakama",
              displayName: user.displayName || user.email || "Nakama",
              email: user.email || "",
              photoURL: user.photoURL || null,
              bio: "",
              phone: "",
              role: "user",
              createdAt: null,
              stats: {
                animesCount: 0,
                postsCount: 0,
                gamesCount: 0,
                xp: 0,
                level: 1,
                rank: 0,
                badge: null,
              },
            }
          }
          onSubmit={handleCreatePost}
          onCancel={() => setShowComposer(false)}
        />
      )}

      {/* ── Liste des publications du feed (avec sondage officiel d'avis application en tête) ── */}
      <FeedList
        posts={[
          OFFICIAL_FEEDBACK_POLL_POST,
          ...posts.filter((p) => p.id !== OFFICIAL_FEEDBACK_POLL_POST.id),
        ]}
        onLike={handleLike}
        emptyMessage={
          loading
            ? "Chargement des posts..."
            : "Aucun post pour le moment 🎌\nSois le premier otaku à poster !"
        }
      />

      {/* FAB — visible uniquement sur mobile */}
      <PublishFAB onClick={() => setShowComposer(true)} />
    </div>
  );
}