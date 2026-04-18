// src/lib/hooks/auth/useLogin.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";

const googleProvider = new GoogleAuthProvider();

export const useLogin = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Écouteur de session en temps réel
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // 🔑 Connexion Email ou Pseudo + Mot de passe
  const loginWithCredentials = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      let email = identifier.trim();

      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      // Si ce n'est pas un email, on cherche l'email lié au pseudo dans Firestore
      if (!email.includes("@")) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", email.toLowerCase()));
        const snap = await getDocs(q);

        if (snap.empty) {
          throw new Error("Pseudo ou email introuvable");
        }

        const userData = snap.docs[0].data();
        if (!userData.email) throw new Error("Email manquant pour ce compte");
        email = userData.email;
      }

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/feed");
    } catch (err) {
      const firebaseErr = err as { code?: string; message: string };
      let message = "Identifiants incorrects";
      
      if (firebaseErr.code === "auth/invalid-credential") {
        message = "Email/Pseudo ou mot de passe incorrect";
      } else if (firebaseErr.code === "auth/user-not-found") {
        message = "Pseudo ou email introuvable";
      } else if (firebaseErr.code === "auth/wrong-password") {
        message = "Mot de passe incorrect";
      } else if (firebaseErr.code === "auth/too-many-requests") {
        message = "Trop de tentatives. Réessaie plus tard.";
      } else if (firebaseErr.code === "auth/user-disabled") {
        message = "Ce compte a été désactivé";
      } else if (firebaseErr.message) {
        message = firebaseErr.message;
      }
      
      setError(message);
      console.error("❌ Erreur login:", firebaseErr);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🌐 Connexion Google
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/feed");
    } catch (err) {
      const firebaseErr = err as { code?: string; message: string };
      if (firebaseErr.code !== "auth/popup-closed-by-user") {
        setError("Échec de la connexion Google");
        console.error("❌ Erreur Google login:", firebaseErr);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🚪 Déconnexion
  const logout = useCallback(async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      const firebaseErr = err as { code?: string; message: string };
      setError(firebaseErr.message || "Erreur déconnexion");
      console.error("❌ Erreur logout:", firebaseErr);
      throw err;
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    clearError: () => setError(null),
  };
};