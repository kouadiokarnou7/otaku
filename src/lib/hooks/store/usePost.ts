import { useState, useEffect, useCallback } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import type { Post, ComposerState } from "@/lib/types";

/**
 * Hook personnalisé pour gérer les posts
 * - Création de posts dans Firestore
 * - Récupération du feed
 * - Gestion des likes/comments
 */
export const usePost = (uid: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Créer un nouveau post ─────────────────────────────────────
  const createPost = useCallback(async (
    content: string,
    mediaUrl?: string,
    tags?: string[],
    animeId?: number // ID Jikan pour lier à un anime
  ) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    if (!content.trim() && !mediaUrl) throw new Error("Le post ne peut pas être vide");

    setLoading(true);
    setError(null);

    try {
      // Récupérer les infos utilisateur depuis Firestore
      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", uid))
      );
      
      let username = "Anonymous";
      let userAvatar = null;
      
      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        username = userData.username || userData.displayName || "Anonymous";
        userAvatar = userData.photoURL || null;
      }

      const postData: Omit<Post, "id"> = {
        uid,
        username,
        userAvatar,
        userLevel: 1, // À améliorer avec le système de niveau
        userBadge: "starter",
        
        content,
        media: mediaUrl ? {
          url: mediaUrl,
          type: mediaUrl.match(/\.(mp4|webm)$/i) ? 'video' : 'image',
        } : undefined,
        
        stats: {
          likes: 0,
          comments: 0,
          shares: 0,
        },
        
        likedByUser: false,
        
        metadata: {
          createdAt: new Date(),
          tags: tags || [],
          visibility: 'public',
          animeId: animeId, // Référence optionnelle à un anime Jikan
        },
      };

      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
        metadata: {
          ...postData.metadata,
          createdAt: serverTimestamp(),
        },
      });

      console.log("✅ Post créé avec ID:", docRef.id);
      return { id: docRef.id, ...postData };
      
    } catch (err: any) {
      console.error("❌ Erreur création post:", err);
      setError(err.message || "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [uid]);

  // ── Récupérer le feed ─────────────────────────────────────
  const fetchFeed = useCallback(async (limitCount: number = 20) => {
    setLoading(true);
    setError(null);

    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("metadata.createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(postsQuery);
      
      const fetchedPosts: Post[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        metadata: {
          ...doc.data().metadata,
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
        },
      } as Post));

      setPosts(fetchedPosts);
      return fetchedPosts;
      
    } catch (err: any) {
      console.error("❌ Erreur récupération feed:", err);
      setError(err.message || "Impossible de charger le feed");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Charger le feed au montage ───────────────────────────────
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // ── Like/Unlike un post ─────────────────────────────────────
  const toggleLike = useCallback(async (postId: string) => {
    // TODO: Implémenter avec updateDoc et transaction
    console.log("Toggle like:", postId);
  }, []);

  // ── Ajouter un commentaire ──────────────────────────────────
  const addComment = useCallback(async (
    postId: string,
    content: string
  ) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        uid,
        content,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      
      // Incrémenter le compteur de commentaires
      // TODO: Utiliser increment() ou transaction
      
    } catch (err: any) {
      console.error("❌ Erreur ajout commentaire:", err);
      throw err;
    }
  }, [uid]);

  return {
    posts,
    loading,
    error,
    createPost,
    fetchFeed,
    toggleLike,
    addComment,
  };
};