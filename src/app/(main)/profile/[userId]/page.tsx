"use client";

import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/store/useProfile";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import AvatarSection from "@/components/features/profile/AvatarSection";
import { ArrowLeft } from "lucide-react";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm animate-pulse uppercase tracking-tighter">Chargement...</p>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const { profile, fetching } = useProfile(userId);

  if (fetching) return <ProfileSkeleton />;
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profil introuvable</h2>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-300 hover:bg-orange-500/30 transition-all"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430]">
      {/* Bouton retour */}
      <div className="sticky top-0 z-20 bg-[#0a0e27]/95 backdrop-blur border-b border-[#1e2540] px-4 py-3">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Retour</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AvatarSection
          photoURL={profile.photoURL}
          displayName={profile.displayName}
          username={profile.username}
          bio={profile.bio}
          stats={profile.stats}
          isEditing={false}
        />
      </div>
    </div>
  );
}