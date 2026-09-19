import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import type { AppNotification, NotificationType } from "@/lib/types";

/**
 * Fonction utilitaire autonome pour créer une notification sans bloquer l'UI
 * Ne déclenche aucune notification si l'auteur de l'action est lui-même le propriétaire.
 */
export async function sendNotification(params: {
  userId: string;
  fromUid: string;
  fromUsername: string;
  fromPhotoURL?: string | null;
  type: NotificationType;
  postId: string;
  commentId?: string;
  contentPreview?: string;
}): Promise<void> {
  // Règle d'or : ne jamais se notifier soi-même
  if (!params.userId || !params.fromUid || params.userId === params.fromUid) {
    return;
  }

  try {
    await addDoc(collection(db, "notifications"), {
      userId: params.userId,
      fromUid: params.fromUid,
      fromUsername: params.fromUsername || "Un Otaku",
      fromPhotoURL: params.fromPhotoURL || null,
      type: params.type,
      postId: params.postId,
      ...(params.commentId && { commentId: params.commentId }),
      ...(params.contentPreview && { contentPreview: params.contentPreview.slice(0, 80) }),
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Échec envoi notification Firestore (silencieux):", err);
  }
}

/**
 * Hook temps réel pour écouter et gérer les notifications de l'utilisateur connecté
 */
export function useNotifications(uid: string | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Requête filtrée sur l'utilisateur destinataire
    const notifsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", uid)
    );

    const unsubscribe = onSnapshot(
      notifsQuery,
      (snapshot) => {
        const list: AppNotification[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAtDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          return {
            id: docSnap.id,
            userId: data.userId,
            fromUid: data.fromUid,
            fromUsername: data.fromUsername || "Un Otaku",
            fromPhotoURL: data.fromPhotoURL || null,
            type: data.type as NotificationType,
            postId: data.postId,
            commentId: data.commentId,
            contentPreview: data.contentPreview,
            read: !!data.read,
            createdAt: createdAtDate,
          };
        });

        // Tri par date décroissante côté client pour garantir la robustesse sans index complexe
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setNotifications(list);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur écouteur notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  // Nombre de notifications non lues
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (err) {
      console.error("Erreur marquer notification comme lue:", err);
    }
  }, []);

  // Tout marquer comme lu
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    try {
      const batch = writeBatch(db);
      unread.forEach((n) => {
        batch.update(doc(db, "notifications", n.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("Erreur marquer toutes les notifications comme lues:", err);
    }
  }, [notifications]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
    } catch (err) {
      console.error("Erreur suppression notification:", err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
