import { useState, useEffect, useCallback } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  where,
  doc,
  getDoc,
  deleteDoc,
  increment,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/firebaseconfig";
import type { Post, Comment } from "@/lib/types";
import { sendNotification } from "@/lib/hooks/store/useNotifications";

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
    animeId?: number,
    poll?: import("@/lib/types").PostPoll
  ) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    if (!content.trim() && !mediaUrl && !poll) throw new Error("Le post ne peut pas être vide");

    setLoading(true);
    setError(null);

    try {
      // Résolution fiable du profil de l'auteur (Firestore doc + auth.currentUser en secours)
      const currentUser = auth.currentUser;
      let username = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Otaku";
      let photoURL = currentUser?.photoURL || null;

      try {
        const userDocSnap = await getDoc(doc(db, "users", uid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          username = userData.displayName || userData.username || username;
          photoURL = userData.photoURL || userData.avatarUrl || userData.avatar || photoURL;
        }
      } catch (err) {
        console.warn("Profil Firestore non accessible pour le post, utilisation du profil Auth:", err);
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
        ...(poll && { poll }),
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

  // ── Mettre en place un listener en temps réel pour les posts ─────
  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("metadata.createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const updatedPosts: Post[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        metadata: {
          ...doc.data().metadata,
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
        },
      } as Post));

      setPosts(updatedPosts);
    }, (error) => {
      console.error("❌ Erreur listener posts:", error);
      setError(getErrorMessage(error));
    });

    return () => unsubscribe();
  }, []);

  // ── Supprimer un post ─────────────────────────────────────────
  const deletePost = useCallback(async (postId: string) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      console.log("✅ Post supprimé avec succès:", postId);
    } catch (err: unknown) {
      console.error("❌ Erreur suppression post:", err);
      setError(getErrorMessage(err));
      throw err;
    }
  }, [uid]);

  const toggleLike = useCallback(async (postId: string, postAuthorUid?: string) => {
    if (!uid) throw new Error("Utilisateur non connecté");

    try {
      const likesRef = collection(db, "posts", postId, "likes");
      const likeQuery = query(likesRef, where("uid", "==", uid));
      const likeSnap = await getDocs(likeQuery);

      const postRef = doc(db, "posts", postId);

      // Le document de like et le compteur partent dans la même écriture
      // atomique : impossible d'avoir un like sans compteur, ou l'inverse.
      const batch = writeBatch(db);

      if (!likeSnap.empty) {
        // ❤️ Unlike : supprimer le like et décrémenter
        batch.delete(doc(db, "posts", postId, "likes", likeSnap.docs[0].id));
        batch.update(postRef, { "stats.likes": increment(-1) });

        await batch.commit();
        console.log("✅ Like supprimé");
      } else {
        // ❤️ Like : ajouter le like et incrémenter
        batch.set(doc(likesRef), {
          uid,
          createdAt: serverTimestamp(),
        });
        batch.update(postRef, { "stats.likes": increment(1) });

        await batch.commit();
        console.log("✅ Like ajouté");

        // Déclencher la notification si ce n'est pas son propre post
        if (postAuthorUid && postAuthorUid !== uid) {
          const currentUser = auth.currentUser;
          sendNotification({
            userId: postAuthorUid,
            fromUid: uid,
            fromUsername: currentUser?.displayName || currentUser?.email?.split('@')[0] || "Un Otaku",
            fromPhotoURL: currentUser?.photoURL || null,
            type: "like_post",
            postId,
          });
        }
      }

      // Le listener en temps réel va rafraîchir les posts automatiquement
    } catch (err: unknown) {
      console.error("❌ Erreur toggle like:", err);
      setError(getErrorMessage(err));
      throw err;
    }
  }, [uid]);

  const addComment = useCallback(async (
    postId: string,
    content: string,
    options?: {
      postAuthorUid?: string;
      parentId?: string | null;
      replyToUsername?: string;
      parentAuthorUid?: string;
    }
  ) => {
    if (!uid) throw new Error("Utilisateur non connecté");
    
    if (!content.trim()) throw new Error("Le commentaire ne peut pas être vide");

    try {
      const currentUser = auth.currentUser;
      let username = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Otaku";
      let userAvatar = currentUser?.photoURL || null;

      try {
        const userDocSnap = await getDoc(doc(db, "users", uid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          username = userData.displayName || userData.username || username;
          userAvatar = userData.photoURL || userData.avatarUrl || userData.avatar || userAvatar;
        }
      } catch (err) {
        console.warn("Profil Firestore non accessible pour le commentaire:", err);
      }

      const commentDocRef = doc(collection(db, "comments"));
      const batch = writeBatch(db);

      batch.set(commentDocRef, {
        postId,
        uid,
        username,
        userAvatar,
        content: content.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        ...(options?.parentId && { parentId: options.parentId }),
        ...(options?.replyToUsername && { replyToUsername: options.replyToUsername }),
      });

      batch.update(doc(db, "posts", postId), {
        "stats.comments": increment(1),
      });

      await batch.commit();

      // Envoi de la notification temps réel
      if (options?.parentId && options?.parentAuthorUid && options.parentAuthorUid !== uid) {
        sendNotification({
          userId: options.parentAuthorUid,
          fromUid: uid,
          fromUsername: username,
          fromPhotoURL: userAvatar,
          type: "reply_comment",
          postId,
          commentId: commentDocRef.id,
          contentPreview: content.trim(),
        });
      } else if (options?.postAuthorUid && options.postAuthorUid !== uid) {
        sendNotification({
          userId: options.postAuthorUid,
          fromUid: uid,
          fromUsername: username,
          fromPhotoURL: userAvatar,
          type: "comment_post",
          postId,
          commentId: commentDocRef.id,
          contentPreview: content.trim(),
        });
      }
    } catch (err: unknown) {
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
    deletePost,
  };
};

/**
 * Hook temps réel pour écouter les commentaires d'une publication spécifique
 */
export const usePostComments = (postId: string | undefined) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Comment[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          return {
            id: docSnap.id,
            postId: data.postId,
            uid: data.uid,
            username: data.username || "Otaku",
            userAvatar: data.userAvatar || null,
            content: data.content,
            createdAt: createdAtDate,
            likes: data.likes || 0,
            parentId: data.parentId || null,
            replyToUsername: data.replyToUsername,
          };
        });

        // Tri par date croissante pour afficher la conversation dans l'ordre chronologique
        list.sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return timeA - timeB;
        });

        setComments(list);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Erreur écouteur commentaires:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  return { comments, loading };
};