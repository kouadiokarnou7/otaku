"use client";

import { useState } from "react";
import type { Post, UserProfile } from "@/lib/types";
import PublishFAB from "@/components/main/PublishFAB";
import FeedList from "@/components/features/feed/FeedList";
import PostComposer from "@/components/features/feed/PostCompose";


// ⚠️ Mocks → à remplacer par useAuth() + useFeed()
const MOCK_USER: UserProfile = {
  uid: "user_123",
  username: "otaku_dev",
  displayName: "Otaku Dev",
  email: "test@example.com",
  photoURL: null,
  bio: "",
  phone: "",
  createdAt: new Date(),
  stats: {
    animesCount: 12,
    postsCount: 5,
    gamesCount: 3,
    xp: 250,
    level: 2,
    rank: 42,
    badge: { id: "starter", name: "Débutant", icon: "🌟", color: "orange" }
  }
};

const MOCK_POSTS: Post[] = [];

export default function FeedPage() {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [currentUser] = useState<UserProfile>(MOCK_USER);
  const [showComposer, setShowComposer] = useState(false);

  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    console.log("Nouveau post:", { content, mediaUrl });
    // TODO: Appel API / Firestore ici
    setShowComposer(false);
  };

  const handleLike = (postId: string) => {
    console.log("Like:", postId);
    // TODO: Optimistic update + sync backend
  };

  return (
    <>
      {/* Header sticky */}
      <div className="sticky top-0 z-20 bg-[#0a0e27]/95 backdrop-blur border-b border-[#1e2540] px-4 py-3">
        <h1 className="text-lg font-bold text-white">Feed</h1>
      </div>

      {/* Contenu principal — pas de pb-24, le layout gère */}
      <div className="px-4 py-4">
        {/* Composer inline (optionnel) */}
        {showComposer && (
          <PostComposer
            user={currentUser}
            onSubmit={handleCreatePost}
            onCancel={() => setShowComposer(false)}
          />
        )}

        {/* Liste des posts */}
        <FeedList
          posts={posts}
          currentUser={currentUser}
          onLike={handleLike}
        />
      </div>

      {/* FAB — visible uniquement sur mobile, au-dessus du banner faut soulever le post  */}
      <div onClick={() => setShowComposer(true)} className="py-4">
        <PublishFAB />
      </div>

      
      
    </>
  );
}