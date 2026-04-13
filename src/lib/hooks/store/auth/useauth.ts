// les fonctions qui permettent de réccupérer l'user connecté et de se déseconnter 
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseconfig";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  // 🔍 Écoute l'état d'authentification au montage du composant
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsInitializing(false); // Session vérifiée
    });
    return () => unsubscribe(); // Nettoyage à la démount
  }, []);

  // 🚪 Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
      router.refresh(); // Force le rechargement des données Next.js (Server Components)
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
      throw error;
    }
  }, [router]);

  return {
    user,
    isInitializing,
    isLoading: isInitializing, // Alias pratique
    logout,
    isAuthenticated: !!user,
  };
};