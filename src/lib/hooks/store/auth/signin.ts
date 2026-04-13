// hooks/useRegister.ts
"use client";

import { useState, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { generateAvatar } from "@/lib/utils";
import { registerSchema } from "@/lib/validators";

const googleProvider = new GoogleAuthProvider();

// 🔥 Générateur de pseudo simple (sans requête Firestore)
function generateUsername(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 12);
  
  // Ajoute un suffixe aléatoire pour éviter les conflits
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}_${suffix}`;
}

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔐 INSCRIPTION EMAIL/PASSWORD
  const registerdata = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Validation Zod
      const validated = registerSchema.parse(data);

      // 2. Création compte Firebase Auth
      const res = await createUserWithEmailAndPassword(
        auth,
        validated.email,
        validated.password
      );
      const user = res.user;

      // 3. Génération pseudo unique (sans requête Firestore)
      const username = generateUsername(validated.username);

      // 4. Avatar : fourni ou généré
      const avatar = validated.avatar ?? generateAvatar(username);

      // 5. Écriture Firestore → ID du document = user.uid ✅
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,              // ✅ Doit correspondre à l'ID du doc
        username,
        email: validated.email,
        avatar: avatar ?? null,
        bio: "",
        createdAt: serverTimestamp(), // ✅ Meilleur que new Date()
        role: "user",
      });

      // 6. Mettre à jour le profil Firebase Auth (optionnel mais recommandé)
      await updateProfile(user, { displayName: username });

      router.push("/feed");
      return user;

    } catch (err: any) {
      // Messages d'erreur plus clairs
      let message = err.message || "Erreur lors de l'inscription";
      if (err.code === "auth/email-already-in-use") {
        message = "Cet email est déjà utilisé";
      } else if (err.code === "auth/weak-password") {
        message = "Mot de passe trop faible (min. 6 caractères)";
      } else if (err.code === "permission-denied") {
        message = "Erreur de permissions Firestore. Vérifie tes règles.";
      }
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false); // ✅ Syntaxe corrigée
    }
  }, [router]);

  // 🌐 GOOGLE SIGN-IN / SIGN-UP
  const registerWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // Pseudo depuis Google ou email
      const baseName = user.displayName || user.email?.split("@")[0] || "otaku";
      const username = generateUsername(baseName);

      const avatar = user.photoURL || generateAvatar(username);

      // Écriture Firestore avec merge:true pour éviter les conflits
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          username,
          email: user.email,
          avatar,
          bio: "",
          createdAt: serverTimestamp(),
          role: "user",
          isOnboarded: false,
        },
        { merge: true }
      );

      router.push("/feed");
      return user;

    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Échec connexion Google");
        throw err;
      }
    } finally {
      setLoading(false); // ✅ Syntaxe corrigée
    }
  }, [router]);

  return {
    registerdata,
    registerWithGoogle,
    loading,
    error,
    clearError: () => setError(null),
  };
}