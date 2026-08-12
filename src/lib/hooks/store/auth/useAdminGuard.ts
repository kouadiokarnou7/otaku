"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import type { UserRole } from "@/lib/types";

/**
 * Garde-fou d'accès aux pages /admin.
 *
 * ⚠️ Ce hook n'est PAS une mesure de sécurité : il s'exécute dans le navigateur
 * et reste contournable. La vraie frontière, c'est les Firestore Security Rules
 * (voir FIRESTORE_RULES.md). Ici on empêche seulement d'afficher une interface
 * d'administration à quelqu'un qui n'y a pas droit.
 *
 * Comportement :
 * - pas de session        → redirection vers /login
 * - session non-admin     → redirection vers /feed
 * - erreur de lecture     → redirection vers /feed (on refuse en cas de doute)
 */
export const useAdminGuard = () => {
  const router = useRouter();
  const { user, isInitializing } = useAuth();

  const [role, setRole] = useState<UserRole | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // On attend que Firebase ait tranché sur l'état de la session
    if (isInitializing) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Évite un setState après démontage si l'utilisateur navigue entre-temps
    let cancelled = false;

    const verifierRole = async () => {
      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        const roleUtilisateur: UserRole = snapshot.exists()
          ? ((snapshot.data().role as UserRole) ?? "user")
          : "user";

        if (cancelled) return;
        setRole(roleUtilisateur);

        if (roleUtilisateur !== "admin") {
          router.replace("/feed");
          return;
        }

        // Rôle confirmé : on autorise le rendu
        setIsChecking(false);
      } catch (err: unknown) {
        console.error("❌ Vérification du rôle admin échouée :", err);
        if (cancelled) return;
        // En cas de doute, on refuse l'accès
        router.replace("/feed");
      }
    };

    verifierRole();

    return () => {
      cancelled = true;
    };
  }, [user, isInitializing, router]);

  return {
    isAdmin: role === "admin",
    // Reste vrai pendant les redirections : le contenu admin n'est jamais peint
    isChecking: isInitializing || isChecking,
  };
};