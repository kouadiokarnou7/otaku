// ============================================================
// components/profile/ProfileHeader.tsx
// ============================================================

import Button from "@/components/ui/button";

interface ProfileHeaderProps {
  onLogout: () => void;
}

export default function ProfileHeader({ onLogout }: ProfileHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8 px-1">
      {/* Titre + breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
          <span className="text-violet-400 text-sm">👤</span>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">
            Otaku Social
          </p>
          <h1 className="text-lg font-bold text-white leading-tight">Mon Profil</h1>
        </div>
      </div>

      {/* Bouton déconnexion */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className="text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-900/10"
        aria-label="Se déconnecter"
      >
        <span className="hidden sm:inline">Déconnexion</span>
        <span className="text-base">🔐</span>
      </Button>
    </header>
  );
}