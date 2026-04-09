// src/lib/store/auth/useLogin.ts
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

      // Si ce n'est pas un email, on cherche l'email lié au pseudo dans Firestore
      if (!email.includes("@")) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", email));
        const snap = await getDocs(q);

        if (snap.empty) {
          throw new Error("Pseudo introuvable");
        }

        const userData = snap.docs[0].data();
        if (!userData.email) throw new Error("Email manquant pour ce compte");
        email = userData.email;
      }

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/feed"); // Redirection après succès
    } catch (err: any) {
      let message = "Identifiants incorrects";
      if (err.code === "auth/invalid-credential") message = "Email/Pseudo ou mot de passe incorrect";
      else if (err.code === "auth/too-many-requests") message = "Trop de tentatives. Réessaie plus tard.";
      else if (err.message) message = err.message;
      
      setError(message);
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
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/feed");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Échec de la connexion Google");
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    loginWithCredentials,
    loginWithGoogle,
    clearError: () => setError(null),
  };
};