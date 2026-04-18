import { useState, useEffect, useCallback } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import type { Post } from "@/lib/types"; // ✅ ComposerState retiré car inutilisé

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

  // Helper pour extraire le message d'erreur de manière type-safe
  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Une erreur inconnue est survenue";
  };

  // ── Créer un nouveau post ─────────────────────────────────────
  const createPost = useCallback(async (
    content: string,
    mediaUrl?: string,
    tags?: string[],
    animeId?: number
  ) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    if (!content.trim() && !mediaUrl) throw new Error("Le post ne peut pas être vide");

    setLoading(true);
    setError(null);

    try {
      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", uid))
      );
      
      let username = "Anonymous";
      let photoURL = null;
      
      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        username = userData.username || userData.displayName || "Anonymous";
        photoURL = userData.photoURL || null;
      }

      const postData: Omit<Post, "id"> = {
        uid,
        username,
        photoURL,
        userLevel: 1,
        userBadge: "starter",
        content,
        ...(mediaUrl && {
          media: {
            url: mediaUrl,
            type: mediaUrl.match(/\.(mp4|webm)$/i) ? 'video' : 'image',
          }
        }),
        stats: { likes: 0, comments: 0, shares: 0 },
        likedByUser: false,
        metadata: {
          createdAt: new Date(),
          tags: tags || [],
          visibility: 'public',
          ...(animeId !== undefined && { animeId }),
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
      
    } catch (err: unknown) { // ✅ Remplacement de `any` par `unknown`
      console.error("❌ Erreur création post:", err);
      setError(getErrorMessage(err)); // ✅ Type guard appliqué
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
      
    } catch (err: unknown) { // ✅ Remplacement de `any` par `unknown`
      console.error("❌ Erreur récupération feed:", err);
      setError(getErrorMessage(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const toggleLike = useCallback(async (postId: string) => {
    console.log("Toggle like:", postId);
  }, []);

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
    } catch (err: unknown) { // ✅ Remplacement de `any` par `unknown`
      console.error("❌ Erreur ajout commentaire:", err);
      throw new Error(getErrorMessage(err));
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