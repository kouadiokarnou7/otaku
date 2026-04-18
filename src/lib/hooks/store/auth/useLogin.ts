// hooks/useLogin.ts
"use client";

import { useState, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FirebaseError,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import type { LoginFormData } from "@/lib/types";

const googleProvider = new GoogleAuthProvider();

/**
 * Récupère l'email d'un utilisateur via son username
 */
async function getEmailByUsername(username: string): Promise<string | null> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username.toLowerCase()));
    const snap = await getDocs(q);
    
    if (snap.empty) return null;
    
    const userDoc = snap.docs[0];
    return userDoc.data().email || null;
  } catch (error) {
    console.error("❌ Erreur récupération email:", error);
    return null;
  }
}

/**
 * Détermine si l'input est un email ou un username
 */
function isEmail(identifier: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔐 CONNEXION EMAIL/PASSWORD OU USERNAME/PASSWORD
  const login = useCallback(async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { identifier, password } = data;
      
      if (!identifier.trim() || !password.trim()) {
        throw new Error("Veuillez remplir tous les champs");
      }

      let emailToUse = identifier;

      // Si c'est un username, récupère l'email correspondant
      if (!isEmail(identifier)) {
        const email = await getEmailByUsername(identifier);
        if (!email) {
          throw new Error("Pseudo ou email introuvable");
        }
        emailToUse = email;
      }

      // Connexion avec Firebase Auth
      const res = await signInWithEmailAndPassword(auth, emailToUse, password);
      
      // ✅ Connexion réussie
      localStorage.setItem("rememberMe", data.rememberMe ? "true" : "false");
      router.push("/feed");
      return res.user;

    } catch (err) {
      const firebaseErr = err as FirebaseError;
      let message = firebaseErr.message || "Erreur lors de la connexion";

      // Messages d'erreur clairs et localisés
      if (firebaseErr.code === "auth/user-not-found") {
        message = "Pseudo ou email introuvable";
      } else if (firebaseErr.code === "auth/wrong-password") {
        message = "Mot de passe incorrect";
      } else if (firebaseErr.code === "auth/invalid-email") {
        message = "Format email invalide";
      } else if (firebaseErr.code === "auth/user-disabled") {
        message = "Ce compte a été désactivé";
      } else if (firebaseErr.code === "auth/too-many-requests") {
        message = "Trop de tentatives. Réessaye plus tard.";
      }

      setError(message);
      console.error("❌ Erreur login:", firebaseErr);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🌐 GOOGLE SIGN-IN
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      router.push("/feed");
      return res.user;

    } catch (err) {
      const firebaseErr = err as FirebaseError;
      if (firebaseErr.code !== "auth/popup-closed-by-user") {
        setError(firebaseErr.message || "Échec connexion Google");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🚪 DÉCONNEXION
  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("rememberMe");
      router.push("/login");
    } catch (err) {
      const firebaseErr = err as FirebaseError;
      setError(firebaseErr.message || "Erreur déconnexion");
      throw err;
    }
  }, [router]);

  return {
    login,
    loginWithGoogle,
    logout,
    loading,
    error,
    clearError: () => setError(null),
  };
}
