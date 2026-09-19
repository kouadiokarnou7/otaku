// src/lib/hooks/auth/useLogin.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

      // Correction automatique si omission de point dans le domaine (ex: gmailcom -> gmail.com)
      if (email.includes("@") && !email.includes(".")) {
        email = email.replace(/@([a-zA-Z0-9_-]+)$/, "@$1.com");
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

      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Si c'est un compte administrateur, rediriger directement vers le cockpit Admin
      try {
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          router.push("/admin/content");
          return;
        }
      } catch (e) {
        // En cas d'erreur de lecture, redirection normale
      }

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

  // 🌐 Connexion Google avec création automatique du profil Firestore
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // 👤 Garantir l'existence du document utilisateur dans Firestore
      try {
        const userRef = doc(db, "users", googleUser.uid);
        const snap = await getDoc(userRef);

        const ADMIN_EMAILS = ["admin@otaku225.ci", "alexandreroxkia@gmail.com", "ppmoi@gmail.com"];
        const isAdminUser = ADMIN_EMAILS.includes(googleUser.email || "");

        if (!snap.exists()) {
          const generatedUsername = (googleUser.displayName || "nakama")
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_")
            .slice(0, 15) || `nakama_${googleUser.uid.slice(0, 5)}`;

          await setDoc(userRef, {
            uid: googleUser.uid,
            username: generatedUsername,
            displayName: googleUser.displayName || "Nakama",
            email: googleUser.email || "",
            photoURL: googleUser.photoURL || null,
            role: isAdminUser ? "admin" : "user",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            stats: {
              animesCount: 0,
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
            },
          });
        }

        // Redirection conditionnelle selon le rôle
        if (isAdminUser || (snap.exists() && snap.data()?.role === "admin")) {
          router.push("/admin/content");
          return;
        }
      } catch (firestoreErr) {
        console.warn("⚠️ Initialisation profil Firestore Google:", firestoreErr);
      }

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

  // 🔑 Réinitialisation de mot de passe par email
  const resetPassword = useCallback(async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Veuillez saisir une adresse email valide.");
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      if (firebaseErr.code === "auth/user-not-found") {
        throw new Error("Aucun compte n'est associé à cette adresse email.");
      } else if (firebaseErr.code === "auth/invalid-email") {
        throw new Error("Format d'adresse email invalide.");
      } else if (firebaseErr.code === "auth/too-many-requests") {
        throw new Error("Trop de demandes. Veuillez patienter quelques minutes.");
      }
      throw new Error(firebaseErr.message || "Impossible d'envoyer l'email de réinitialisation.");
    }
  }, []);

  return {
    user,
    loading,
    error,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError: () => setError(null),
  };
};