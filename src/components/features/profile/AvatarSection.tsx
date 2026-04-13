// ============================================================
// components/profile/AvatarSection.tsx
// ============================================================

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarSectionProps {
  photoURL: string | null;
  preview: string | null;
  displayName: string;
  username?: string;
  isEditing: boolean;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AvatarSection({
  photoURL,
  preview,
  displayName,
  username,
  isEditing,
  onImageSelect,
}: AvatarSectionProps) {
  const imgSrc = preview || photoURL || "/default-avatar.png";
  const initial = displayName?.[0]?.toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      {/* Glow ring + avatar */}
      <div className="relative">
        {/* Halo violet animé en mode édition */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            isEditing
              ? "ring-2 ring-violet-500 ring-offset-4 ring-offset-[#0a0e27] shadow-[0_0_30px_rgba(139,95,230,0.5)] animate-pulse"
              : "ring-2 ring-violet-500/30 ring-offset-2 ring-offset-[#0a0e27]"
          )}
        />

        {/* Avatar image ou initiale */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#1a2040]">
          {photoURL || preview ? (
            <Image
              src={imgSrc}
              alt={`Avatar de ${displayName}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            // Fallback : initiale stylée
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-purple-900">
              <span className="text-3xl font-black text-white">{initial}</span>
            </div>
          )}
        </div>

        {/* Bouton upload (visible uniquement en mode édition) */}
        {isEditing && (
          <label
            htmlFor="avatar-input"
            className={cn(
              "absolute -bottom-1 -right-1",
              "w-9 h-9 rounded-full",
              "bg-violet-600 hover:bg-violet-500",
              "border-2 border-[#0a0e27]",
              "flex items-center justify-center",
              "cursor-pointer transition-all duration-200",
              "hover:scale-110 active:scale-95",
              "shadow-[0_0_12px_rgba(139,95,230,0.6)]",
              "text-base"
            )}
            title="Changer l'avatar"
          >
            📷
            <input
              id="avatar-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={onImageSelect}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {/* Nom + username */}
      <div className="text-center">
        <p className="text-white font-bold text-lg leading-tight">
          {displayName || "Anonyme"}
        </p>
        {username && (
          <p className="text-violet-400 text-sm font-medium">@{username}</p>
        )}
        {isEditing && (
          <p className="text-gray-600 text-xs mt-1">Clique sur 📷 pour changer</p>
        )}
      </div>
    </div>
  );
}