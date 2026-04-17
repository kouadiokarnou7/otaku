"use client";

import { useState, useEffect } from "react";
import type { Post, UserProfile } from "@/lib/types";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { usePost } from "@/lib/hooks/store/usePost";
import { useProfile } from "@/lib/hooks/store/useProfile";
import PublishFAB from "@/components/main/PublishFAB";
import FeedList from "@/components/features/feed/FeedList";
import PostComposer from "@/components/features/feed/PostCompose";
import { uploadAvatar } from "@/lib/firebase/storage";

export default function FeedPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile } = useProfile(user?.uid);
  const { posts, loading, error, createPost, fetchFeed, toggleLike } = usePost(user?.uid);
  
  const [showComposer, setShowComposer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Rafraîchir le feed au montage
  useEffect(() => {
    if (user?.uid) {
      fetchFeed();
    }
  }, [user?.uid]);

  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    if (!user) return;
    
    try {
      let uploadedMediaUrl = mediaUrl;
      
      // Si un fichier média est fourni, on l'upload d'abord
      // Note: PostComposer passe actuellement undefined, à améliorer
      if (mediaUrl && mediaUrl.startsWith('data:')) {
        // Convertir base64 en File et uploader
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

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
    // Optimistic update pourrait être ajouté ici
  };

  // État de chargement
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Bienvenue sur Otaku Social 🎌</h1>
        <p className="text-gray-400 text-center mb-6">
          Connecte-toi pour accéder au feed et partager ta passion !
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header sticky */}
      <div className="sticky top-0 z-20 bg-[#0a0e27]/95 backdrop-blur border-b border-[#1e2540] px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Feed</h1>
          <button 
            onClick={() => fetchFeed()}
            disabled={loading}
            className="text-orange-500 hover:text-orange-400 transition"
          >
            {loading ? "..." : "↻"}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-4">
        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Composer modal — s'ouvre dès que l'user est connu, profil en fallback */}
        {showComposer && user && (
          <PostComposer
            user={profile ?? {
              uid: user.uid,
              username: user.displayName || user.email || "Nakama",
              displayName: user.displayName || user.email || "Nakama",
              email: user.email || "",
              photoURL: user.photoURL || null,
              bio: "",
              phone: "",
              createdAt: null,
              stats: { animesCount:0, followersCount:0, followingCount:0, postsCount:0 },
            }}
            onSubmit={handleCreatePost}
            onCancel={() => setShowComposer(false)}
          />
        )}

        {/* Liste des posts */}
        <FeedList
          posts={posts}
          currentUser={profile!}
          onLike={handleLike}
          emptyMessage={loading ? "Chargement des posts..." : "Aucun post pour le moment 🎮\nSois le premier à poster !"}
        />
      </div>

      {/* FAB — visible uniquement sur mobile */}
      <PublishFAB onClick={() => setShowComposer(true)} />
    </>
  );
}