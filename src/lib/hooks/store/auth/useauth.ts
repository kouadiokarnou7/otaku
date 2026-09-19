import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, deleteUser, User } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";

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
    return () => unsubscribe(); // Nettoyage au démontage
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

  // 🗑️ Fonction de suppression définitive du compte
  const deleteAccount = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    try {
      const uid = currentUser.uid;
      // 1. Suppression du document profil dans Firestore
      try {
        await deleteDoc(doc(db, "users", uid));
      } catch (firestoreErr) {
        console.warn("Notice: Impossible de supprimer le document Firestore utilisateur", firestoreErr);
      }

      // 2. Suppression du compte dans Firebase Authentication
      await deleteUser(currentUser);

      // 3. Redirection vers la page d'inscription / accueil
      router.push("/register");
      router.refresh();
    } catch (error: unknown) {
      console.error("❌ Erreur lors de la suppression du compte :", error);
      throw error;
    }
  }, [router]);

  return {
    user,
    isInitializing,
    isLoading: isInitializing, // Alias pratique
    logout,
    deleteAccount,
    isAuthenticated: !!user,
  };
};