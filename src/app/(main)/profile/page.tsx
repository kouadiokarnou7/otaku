"use client";

import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import AvatarSection from "@/components/features/profile/AvatarSection";
import ProfileForm from "@/components/features/profile/ProfileForm";
import Message from "@/components/ui/Message";
import Button from "@/components/ui/button";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm animate-pulse uppercase tracking-tighter">Chargement...</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, isInitializing } = useAuth();

  const {
    profile,
    formData,
    preview,
    isEditing,
    loading,
    fetching,
    message,
    setIsEditing,
    handleChange,
    handleImageSelect,
    handleSubmit,
    cancelEditing,
  } = useProfile(user?.uid);

  if (isInitializing || fetching) return <ProfileSkeleton />;
  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative selection:bg-orange-500">
      
      

      {/* CONTENEUR PRINCIPAL 
          On enlève la "Card" (la div avec bordure) pour que les sections 
          soient posées directement sur le fond noir.
      */}
      
        {/* En-tête sans boîte autour */}
        <ProfileHeader onLogout={logout} />

       
          {/* Section Avatar */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AvatarSection
              photoURL={profile.photoURL}
              preview={preview}
              displayName={profile.displayName}
              username={profile.username}
              isEditing={isEditing}
              onImageSelect={handleImageSelect}
            />
          </section>

          {/* Séparateur minimaliste */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

          {/* Section Formulaire */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <ProfileForm
              email={profile.email}
              formData={formData}
              stats={profile.stats}
              isEditing={isEditing}
              loading={loading}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onEdit={() => setIsEditing(true)}
              onCancel={cancelEditing}
            />
          </section>

          {/* Feedback & Actions */}
          <div className="flex flex-col items-center gap-8">
            <Message message={message} />
            
            <Button 
              onClick={logout} 
              className="px-8 py-2 bg-transparent border border-white/10 hover:border-red-500/50 hover:text-red-500 transition-all rounded-full text-xs uppercase tracking-widest"
            >
              Déconnexion
            </Button>
          </div>
        

        {/* Footer */}
        <p className="text-center text-[10px] text-zinc-600 mt-20 uppercase tracking-[0.3em]">
          Otaku Social — Espace Personnel
        </p>
      
    </div>
  );
}