
import { useState, useEffect, useCallback } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { uploadAvatar } from "@/lib/firebase/storage";
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
 
  // ── Chargement initial depuis Firestore ─────────────────────
  useEffect(() => {
    if (!uid) return;
 
    const fetchProfile = async () => {
      setFetching(true);
      try {
        const snap = await getDoc(doc(db, "users", uid));
        const user = auth.currentUser;
 
        const base: UserProfile = {
          uid,
          username: snap.data()?.username || "",
          displayName: user?.displayName || snap.data()?.displayName || "",
          email: user?.email || "",
          photoURL: user?.photoURL || snap.data()?.photoURL || null,
          bio: snap.data()?.bio || "",
          phone: snap.data()?.phone || "",
          // Défaut prudent : en l'absence de rôle en base, on suppose "user"
          role: snap.data()?.role === "admin" ? "admin" : "user",
          createdAt: snap.data()?.createdAt?.toDate() || null,
          stats: snap.data()?.stats || DEFAULT_STATS,
        };
 
        setProfile(base);
        setFormData({
          displayName: base.displayName,
          bio: base.bio,
          phone: base.phone,
        });
      } catch (err) {
        console.error("❌ Erreur chargement profil :", err);
      } finally {
        setFetching(false);
      }
    };
 
    fetchProfile();
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
            // ✅ TS sait maintenant que avatarFile est de type File
            photoURL = await uploadAvatar(user.uid, avatarFile);
          }
        // Mise à jour Firebase Auth
        await updateProfile(user, {
          displayName: formData.displayName,
          photoURL: photoURL || null,
        });
        
        // Mise à jour Firestore
        await setDoc(
          doc(db, "users", user.uid),
          {
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
 