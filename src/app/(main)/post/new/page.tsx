"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, BarChart3, Smile, Plus, Trash2, Globe, Film, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { usePost } from "@/lib/hooks/store/usePost";
import { uploadAvatar } from "@/lib/firebase/storage";

type PostMode = "status" | "poll";

// Humeurs / ressentis otaku (style WhatsApp & Facebook)
const MOODS = [
  { label: "Se sent hype", emoji: "🔥" },
  { label: "En larmes devant l'épisode", emoji: "😭" },
  { label: "Mode combat activé", emoji: "⚔️" },
  { label: "Session marathon", emoji: "🍿" },
  { label: "Choqué par le plot twist", emoji: "🤯" },
  { label: "Gojo est le GOAT", emoji: "👑" },
];

// Réactions émojis rapides de la maquette (Écran 3)
const QUICK_EMOJIS = ["😍", "🔥", "👑", "💀", "🌙", "⚡", "✨"];

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createPost } = usePost(user?.uid);

  const [mode, setMode] = useState<PostMode>("status");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [animeTag, setAnimeTag] = useState("");
  const [isTaggingAnime, setIsTaggingAnime] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Pour le mode Sondage (Poll)
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion upload image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Gestion des options de sondage
  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const next = [...pollOptions];
    next[index] = val;
    setPollOptions(next);
  };

  // Soumission
  const handleSubmit = async () => {
    if (!user) {
      setError("Tu dois être connecté pour publier.");
      return;
    }

    if (mode === "status" && !content.trim() && !mediaFile) {
      setError("Veuillez saisir un message ou ajouter une image.");
      return;
    }

    if (mode === "poll" && (!pollQuestion.trim() || pollOptions.some((o) => !o.trim()))) {
      setError("Veuillez renseigner la question et toutes les options du sondage.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let uploadedUrl: string | undefined = undefined;
      if (mediaFile) {
        uploadedUrl = await uploadAvatar(user.uid, mediaFile);
      }

      // Formatage du texte avec le ressenti et sondage si présent
      let finalContent = content.trim();
      if (selectedMood) {
        finalContent = `${selectedMood}\n\n${finalContent}`;
      }
      if (animeTag) {
        finalContent = `[🏷️ ${animeTag}]\n${finalContent}`;
      }
      let pollData = undefined;
      if (mode === "poll") {
        pollData = {
          question: pollQuestion.trim(),
          options: pollOptions.map((opt, i) => ({
            id: `opt-${i + 1}`,
            text: opt.trim(),
            votes: 0,
          })),
          totalVotes: 0,
        };
      }

      await createPost(finalContent, uploadedUrl, undefined, undefined, pollData);
      router.push("/feed");
    } catch (err) {
      console.error("❌ Erreur publication:", err);
      setError("Impossible de publier. Réessaye dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4 pb-24 text-foreground">
      {/* ── En-tête : Retour, Titre, Visibilité (Écran 3) ── */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="flex size-9 items-center justify-center rounded-xl bg-card/60 text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="font-heading text-sm font-bold text-white tracking-wide">
          Créer une publication
        </h1>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card/80 border border-border/80 text-[11px] font-semibold text-muted-foreground">
          <Globe size={12} className="text-primary" />
          <span>Public</span>
        </div>
      </div>

      {/* ── Sélecteur de mode : Statut / Ressenti OU Sondage ── */}
      <div className="flex rounded-2xl border border-border/70 bg-card/60 p-1">
        <button
          type="button"
          onClick={() => setMode("status")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === "status"
              ? "bg-primary text-white shadow-md shadow-violet-500/20"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          <Smile size={14} />
          <span>Statut & Ressenti</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("poll")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === "poll"
              ? "bg-primary text-white shadow-md shadow-violet-500/20"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          <BarChart3 size={14} />
          <span>Sondage Otaku</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400">
          {error}
        </div>
      )}

      {/* ── Auteur info ── */}
      <div className="flex items-center gap-2.5">
        <div className="relative size-9 rounded-full overflow-hidden bg-primary/20 border border-primary/40">
          <Image
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.displayName || "Otaku"
              )}&background=8B5CF6&color=fff&size=100`
            }
            alt="Profil"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xs font-bold text-white">
          @{user?.displayName || "kuro_otaku"}
        </span>

        {selectedMood && (
          <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            {selectedMood}
            <button
              onClick={() => setSelectedMood(null)}
              className="text-[10px] ml-1 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </span>
        )}
      </div>

      {/* ── Corps : Mode Statut / Ressenti ── */}
      {mode === "status" && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Quoi de neuf, otaku ?"
              maxLength={500}
              className="w-full rounded-2xl border border-border/80 bg-card/70 p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all resize-none shadow-sm"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-muted-foreground">
              {content.length}/500
            </span>
          </div>

          {/* Sélecteur de ressentis / humeurs (Style WhatsApp / Facebook) */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles size={12} className="text-primary" />
              Ton humeur du moment :
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(`${m.emoji} ${m.label}`)}
                  className="shrink-0 px-3 py-1.5 rounded-xl border border-border/70 bg-card/60 text-xs text-foreground/80 hover:border-primary/40 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>{m.emoji}</span>
                  <span className="text-[11px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Émojis rapides de la maquette (😍 🔥 👑 💀 🌙) */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-[11px] text-muted-foreground font-medium mr-1">Réactions :</span>
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setContent((prev) => prev + " " + emoji)}
                className="text-base hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Prévisualisation de l'image si uploadée */}
          {mediaPreview && (
            <div className="relative rounded-2xl overflow-hidden border border-border/80 aspect-video bg-black/40">
              <Image src={mediaPreview} alt="Aperçu" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setMediaPreview(null);
                  setMediaFile(null);
                }}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-black"
              >
                ✕
              </button>
            </div>
          )}

          {/* Zone d'ajout d'image */}
          <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-card/40 hover:bg-card/70 cursor-pointer transition-all">
            <ImageIcon size={28} className="text-primary/80 mb-2" />
            <span className="text-xs font-semibold text-white">Ajouter une image</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG ou WebP</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      )}

      {/* ── Corps : Mode Sondage (Poll façon Twitter/WhatsApp) ── */}
      {mode === "poll" && (
        <div className="space-y-3 rounded-2xl border border-border/80 bg-card/60 p-4">
          {/* Bouton modèle rapide d'avis application */}
          <button
            type="button"
            onClick={() => {
              setPollQuestion("Votre avis général sur l'application Nekama :");
              setPollOptions([
                "🔥 Incroyable, j'adore le style !",
                "✨ Très prometteur pour la suite",
                "🛠️ Des améliorations à apporter",
                "🐛 Signaler des bugs rencontrés",
              ]);
              setContent("Donnez-nous votre avis pour améliorer l'application ! Votez ci-dessous :");
            }}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
          >
            <Sparkles size={13} />
            <span>⚡ Utiliser le modèle : Recueillir l&apos;avis sur l&apos;application</span>
          </button>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white">Question du sondage</label>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ex: Quel est le meilleur anime de la saison ?"
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-white">Options de vote</label>
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                  placeholder={`Choix ${idx + 1}`}
                  className="flex-1 h-9 px-3 rounded-xl border border-border/80 bg-background/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePollOption(idx)}
                    className="text-muted-foreground hover:text-red-400 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            {pollOptions.length < 4 && (
              <button
                type="button"
                onClick={handleAddPollOption}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <Plus size={14} />
                <span>Ajouter un choix ({pollOptions.length}/4)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Tag Anime / Manga (Écran 3) ── */}
      <div className="pt-1">
        {isTaggingAnime ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={animeTag}
              onChange={(e) => setAnimeTag(e.target.value)}
              placeholder="Nom de l'anime ou manga..."
              className="flex-1 h-9 px-3 rounded-xl border border-primary/50 bg-card/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setIsTaggingAnime(false)}
              className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-white"
            >
              OK
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsTaggingAnime(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all"
          >
            <Film size={13} />
            <span>{animeTag ? `Anime lié : ${animeTag}` : "+ Anime / Manga"}</span>
          </button>
        )}
      </div>

      {/* ── Actions inférieures : Brouillon & Publier (Écran 3) ── */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/70">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 rounded-2xl border border-border/80 bg-card/60 text-xs font-bold text-muted-foreground hover:text-white transition-all"
        >
          Brouillon
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-primary to-indigo-600 text-xs font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
        >
          {submitting ? "Publication…" : "Publier"}
        </button>
      </div>
    </div>
  );
}