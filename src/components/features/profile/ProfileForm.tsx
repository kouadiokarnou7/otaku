// ============================================================
// components/profile/ProfileForm.tsx
// ============================================================


import FormField from "./FormField";

import ProfileActions from "./ProfileActions";
import type { ProfileFormData, ProfileStats } from "@/lib/types";

interface ProfileFormProps {
  email: string;
  formData: ProfileFormData;
  stats: ProfileStats;
  isEditing: boolean;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: () => void;
  onCancel: () => void;
}

export default function ProfileForm({
  email,
  formData,
  stats,
  isEditing,
  loading,
  onChange,
  onSubmit,
  onEdit,
  onCancel,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {/* Stats + boutons d'action */}
      <ProfileActions
        stats={stats}
        isEditing={isEditing}
        loading={loading}
        onEdit={onEdit}
        onCancel={onCancel}
      />
      {/* Nom d'affichage */}
      <FormField
        label="Nom d'affichage"
        name="displayName"
        value={formData.displayName}
        isEditing={isEditing}
        inputProps={{
          onChange,
          placeholder: "Ton pseudo otaku...",
          required: true,
          minLength: 2,
          maxLength: 32,
        }}
      />

      {/* Email (toujours readonly) */}
      <FormField
        label="Email"
        name="email"
        value={email}
        isEditing={false}
        hint="L'email n'est pas modifiable ici"
      />

      {/* Bio */}
      <FormField
        label="Bio"
        name="bio"
        value={formData.bio}
        isEditing={isEditing}
        multiline
        rows={3}
        maxLength={150}
        textareaProps={{
          onChange,
          placeholder: "Ton anime préféré, ton arc favori, ton waifu...",
        }}
      />

      {/* Téléphone */}
      <FormField
        label="Téléphone"
        name="phone"
        value={formData.phone}
        isEditing={isEditing}
        type="tel"
        inputProps={{
          onChange,
          placeholder: "+225 XX XX XX XX",
        }}
      />

      {/* Séparateur */}
      <div className="border-t border-[#1e2540] my-1" />

      
    </form>
  );
}