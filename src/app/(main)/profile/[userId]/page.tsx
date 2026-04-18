"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/store/auth/useauth";

export default function ProfileRedirect() {
  const router = useRouter();
  const { user, isInitializing } = useAuth();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (isInitializing) return; // Wait for auth state

    if (!user) {
      // Not logged in - redirect to login
      router.push("/login");
      return;
    }

    // Logged in - redirect to their profile
    router.push(`/profile/${user.uid}`);
    setRedirecting(false);
  }, [user, isInitializing, router]);

  // Loading state
  if (redirecting || isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm animate-pulse uppercase tracking-tighter">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return null;
}
