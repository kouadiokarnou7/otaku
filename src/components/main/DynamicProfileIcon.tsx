
"use client";

import { User } from "lucide-react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import Image from "next/image";

export default function DynamicProfileIcon() {
  const { user, isInitializing } = useAuth();

  // 🔹 Phase de chargement Firebase
  if (isInitializing) {
    return <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />;
  }

  // 🔹 Utilisateur non connecté → icône par défaut
  if (!user) {
    return <User className="w-5 h-5 text-gray-400" />;
  }

  // 🔹 Utilisé connecté : priorité PhotoURL (Google) > Initiales (Username/Email)
  const initials = (user.displayName || user.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const hasPhoto = !!user.photoURL;

  return hasPhoto ? (
    <Image
      src={user.photoURL}
      alt="Avatar"
      width={32}
      height={32}
      priority
      className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-orange-500 transition-all"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold text-white border-2 border-transparent hover:border-orange-500 transition-all">
      {initials}
    </div>
  );
}