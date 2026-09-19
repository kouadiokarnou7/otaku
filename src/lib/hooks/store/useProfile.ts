
import { useState, useEffect, useCallback } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { uploadAvatar } from "@/lib/firebase/storage";
import { compressImage } from "@/lib/utils/imageCompressor";
import type {
  UserProfile,
  ProfileFormData,
  FeedbackMessage,
} from "@/lib/types";
 
const DEFAULT_STATS = {
  animesCount: 0,
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
};
 
export function useProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "",
    bio: "",
    phone: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<FeedbackMessage>({ type: "", text: "" });
 
  // ── Synchronisation temps réel depuis Firestore ─────────────────────
  useEffect(() => {
    if (!uid) {
      setFetching(false);
      return;
    }
 
    setFetching(true);
    const userDocRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (snap) => {
        const user = auth.currentUser;
        const data = snap.data();
        let localAvatar: string | null = null;
        try {
          localAvatar = localStorage.getItem(`nekama_avatar_${uid}`);
        } catch (e) {}

        const base: UserProfile = {
          uid,
          username: data?.username || user?.displayName || "",
          displayName: data?.displayName || user?.displayName || "",
          email: user?.email || "",
          photoURL: localAvatar || data?.photoURL || data?.avatarUrl || data?.avatar || user?.photoURL || null,
          bio: data?.bio || "",
          phone: data?.phone || "",
          role: data?.role === "admin" ? "admin" : "user",
          createdAt: data?.createdAt?.toDate() || null,
          stats: data?.stats || DEFAULT_STATS,
        };

        setProfile(base);
        setFormData({
          displayName: base.displayName,
          bio: base.bio,
          phone: base.phone,
        });
        setFetching(false);
      },
      (err) => {
        console.error("❌ Erreur écoute profil :", err);
        setFetching(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);
 
  // ── Gestion champ formulaire ─────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );
 
  // ── Sélection image avatar ───────────────────────────────────
 const handleImageSelect = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔍 DEBUG : Voir ce que reçoit vraiment ton code
    console.log('🔍 DEBUG FILE:', {
      name: file.name,
      type: file.type || '(VIDE)',
      size: `${Math.round(file.size / 1024)} KB`,
      extension: file.name.split('.').pop(),
      instanceof: file instanceof File,
    });

    // ✅ Stocker le fichier pour l'upload
    setAvatarFile(file);
    
    // 🖼️ Générer la preview pour l'UI
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  },
  [] // 👈 Dependencies vides car on n'utilise pas de variables externes
);
 
  // ── Sauvegarde du profil ─────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const user = auth.currentUser;
      if (!user) return;
 
      setLoading(true);
      setMessage({ type: "", text: "" });
 
      try {
        let photoURL = profile?.photoURL || "";

        if (avatarFile && avatarFile instanceof File) {
          try {
            const { base64, file: compressedFile } = await compressImage(avatarFile, 320, 0.82);
            photoURL = base64;
            try {
              const storageUrl = await uploadAvatar(user.uid, compressedFile);
              if (storageUrl) {
                photoURL = storageUrl;
              }
            } catch (storageErr) {
              console.warn("Storage non disponible, utilisation du format compressé:", storageErr);
            }
          } catch (compressErr) {
            console.warn("Erreur compression, tentative upload direct:", compressErr);
            try {
              photoURL = await uploadAvatar(user.uid, avatarFile);
            } catch (e) {}
          }
        }

        if (photoURL) {
          try {
            localStorage.setItem(`nekama_avatar_${user.uid}`, photoURL);
          } catch (e) {}
        }

        // Mise à jour Firebase Auth (uniquement si URL HTTP valide, sinon Auth rejette les data: URLs)
        try {
          await updateProfile(user, {
            displayName: formData.displayName,
            photoURL: photoURL.startsWith("http") ? photoURL : undefined,
          });
        } catch (authErr) {
          console.warn("Mise à jour Auth profil ignorée:", authErr);
        }
        
        // Mise à jour Firestore
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            displayName: formData.displayName,
            bio: formData.bio,
            phone: formData.phone,
            username: profile?.username || user.displayName || "",
            photoURL,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
 
        setProfile((prev) =>
          prev
            ? { ...prev, ...formData, photoURL }
            : null
        );
 
        setMessage({ type: "success", text: "✅ Profil mis à jour avec succès !" });
        setIsEditing(false);
        setPreview(null);
        setAvatarFile(null);

        // 🔄 Recharger la page après un court délai pour actualiser le header global
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (err) {
        console.error("❌ Erreur mise à jour :", err);
        setMessage({ type: "error", text: "❌ Une erreur est survenue. Réessayez." });
      } finally {
        setLoading(false);
      }
    },
    [formData, avatarFile, profile]
  );
 
  // ── Annuler l'édition ────────────────────────────────────────
  const cancelEditing = useCallback(() => {
    if (!profile) return;
    setFormData({
      displayName: profile.displayName,
      bio: profile.bio,
      phone: profile.phone,
    });
    setPreview(null);
    setAvatarFile(null);
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  }, [profile]);
 
  return {
    profile,
    formData,
    preview,
    isEditing,
    loading,
    fetching,
    message,
    setIsEditing,
    handleChange,
    handleImageSelect,
    handleSubmit,
    cancelEditing,
  };
}
 