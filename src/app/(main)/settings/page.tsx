"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Palette,
  ShieldCheck,
  Lock,
  Star,
  Check,
  LogOut,
  Trash2,
  AlertTriangle,
  X,
  Pipette,
  Sparkles,
  Construction,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  THEME_COLORS,
  BACKGROUND_PRESETS,
  applyThemeColor,
  getSavedThemeColor,
  applyBackgroundColor,
  getSavedBackgroundColor,
  setFavoriteAccentColor,
  getFavoriteAccentColor,
} from "@/lib/theme/themeColors";

// Sections des paramètres avec ordre demandé :
// 1. Mon compte, 2. Apparence & Thème, 3. Confidentialité, 4. Sécurité & Compte
const SETTINGS_SECTIONS = [
  {
    id: "account" as const,
    label: "Mon compte",
    icon: User,
    desc: "Profil, pseudo et photo",
  },
  {
    id: "theme" as const,
    label: "Apparence & Thème",
    icon: Palette,
    desc: "Couleurs de fond et boutons",
  },
  {
    id: "privacy" as const,
    label: "Confidentialité",
    icon: ShieldCheck,
    desc: "Visibilité et données privées",
  },
  {
    id: "security" as const,
    label: "Sécurité & Compte",
    icon: Lock,
    desc: "Session et suppression de compte",
  },
] as const;

type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number]["id"];

/**
 * Page des paramètres Nekama avec navigation par liste latérale de boutons (Master-Detail).
 * Cliquez sur un onglet à gauche pour afficher son contenu dédié à côté (ou en dessous sur mobile).
 */
export default function SettingsPage() {
  const { user, logout, deleteAccount, isInitializing } = useAuth();
  const {
    profile,
    formData,
    handleChange,
    handleSubmit,
    loading,
    message,
    preview,
    handleImageSelect,
  } = useProfile(user?.uid);
  const router = useRouter();

  // Onglet actif
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("account");

  // Modales
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Personnalisation des couleurs
  const [accentColor, setAccentColor] = useState<string>(THEME_COLORS[0].hex);
  const [favoriteColor, setFavoriteColorState] = useState<string>(THEME_COLORS[0].hex);
  const [bgColor, setBgColor] = useState<string>(BACKGROUND_PRESETS[0].bgHex);

  // Initialisation au montage
  useEffect(() => {
    const savedAccent = getSavedThemeColor();
    setAccentColor(savedAccent);

    const savedFav = getFavoriteAccentColor();
    setFavoriteColorState(savedFav);

    const savedBg = getSavedBackgroundColor();
    setBgColor(savedBg.bg);
  }, []);

  // Application de la couleur de bouton / accent
  const handleSelectAccent = (hex: string) => {
    setAccentColor(hex);
    applyThemeColor(hex);
  };

  // Définir la couleur favorite (affichée dans le Header)
  const handleSetFavorite = (hex: string) => {
    setFavoriteColorState(hex);
    setFavoriteAccentColor(hex);
    handleSelectAccent(hex);
  };

  // Application de la couleur de fond
  const handleSelectBg = (bgHex: string, cardHex?: string) => {
    setBgColor(bgHex);
    applyBackgroundColor(bgHex, cardHex);
  };

  // Redirection si non connecté
  useEffect(() => {
    if (!isInitializing && !user) {
      router.replace("/login");
    }
  }, [isInitializing, user, router]);

  // Déconnexion
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erreur déconnexion:", err);
      setShowLogoutConfirm(false);
    }
  }, [logout]);

  // Suppression définitive de compte
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim() !== "SUPPRIMER") return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteAccount();
    } catch (err: unknown) {
      setIsDeleting(false);
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === "auth/requires-recent-login") {
        setDeleteError("Pour votre sécurité, veuillez vous reconnecter avant de supprimer votre compte.");
      } else {
        setDeleteError(errorObj?.message || "Erreur lors de la suppression du compte.");
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div
          className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
          role="status"
          aria-label="Chargement des paramètres"
        />
        <p className="text-xs text-muted-foreground font-medium">Chargement des paramètres…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen pb-24 text-foreground bg-background transition-colors duration-300">
      {/* ── Header sticky ── */}
      <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border/80 bg-background/90 px-4 backdrop-blur-xl">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 pr-8 text-center font-heading text-base font-extrabold text-white">
          Paramètres
        </h1>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        {/* ══════════ APERÇU PROFIL EN-TÊTE ══════════ */}
        <Link
          href="/profile"
          className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/80 p-3.5 transition-all hover:border-primary/50 no-underline shadow-sm"
        >
          {profile?.photoURL ? (
            <div className="relative size-12 shrink-0 rounded-full overflow-hidden border border-primary/40">
              <Image
                src={profile.photoURL}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-black text-white shadow-sm">
              {(profile?.displayName || user.email || "U")[0].toUpperCase()}
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-white">
              {profile?.displayName || "Mon profil"}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {profile?.username ? `@${profile.username}` : user.email}
            </span>
          </span>

          <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
        </Link>

        {/* ══════════ BARRE DE BOUTONS MOBILE (DÉFILEMENT HORIZONTAL) ══════════ */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {SETTINGS_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex shrink-0 items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "border-primary bg-primary/20 text-white shadow-sm"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-primary" : ""} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════ STRUCTURE EN 2 COLONNES (STYLE FIREBASE CONSOLE) ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* ── COLONNE GAUCHE (LISTE DE BOUTONS DES SECTIONS) ── */}
          <div className="hidden md:flex md:col-span-4 flex-col gap-1.5 rounded-2xl border border-border/80 bg-card/60 p-2 shadow-sm">
            <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Menu
            </p>
            {SETTINGS_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all border ${
                    isActive
                      ? "border-primary/50 bg-primary/15 text-white shadow-sm font-bold"
                      : "border-transparent text-muted-foreground hover:bg-card hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 ${isActive ? "text-primary" : ""}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-snug">
                      {sec.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 truncate">
                      {sec.desc}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight size={15} className="text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── COLONNE DROITE (CONTENU QUI RESSORT AU CLIC) ── */}
          <div className="md:col-span-8 min-w-0">
            {/* 1. MON COMPTE */}
            {activeSection === "account" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 pb-1">
                  <User size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-white font-heading">
                    Mon compte
                  </h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="bg-card/80 rounded-2xl border border-border/80 p-4 space-y-4 shadow-sm"
                >
                  {/* Photo de profil */}
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="relative group size-20">
                      <div className="size-full rounded-full overflow-hidden border-2 border-primary/40 bg-muted flex items-center justify-center relative shadow-md">
                        {preview || profile?.photoURL ? (
                          <Image
                            src={preview || profile?.photoURL || ""}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-2xl font-black uppercase text-muted-foreground">
                            {(profile?.displayName || user.email || "U")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor="avatar-settings-input"
                        className="absolute bottom-0 right-0 size-7 rounded-full bg-primary flex items-center justify-center cursor-pointer border-2 border-card hover:bg-primary/80 transition-colors shadow-md"
                        title="Changer la photo de profil"
                      >
                        <span className="text-xs">📷</span>
                        <input
                          id="avatar-settings-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Changer la photo de profil
                    </p>
                  </div>

                  <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70 bg-background/60">
                    <FieldRow label="Pseudo" htmlFor="displayName">
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Ton pseudo"
                        className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right text-xs font-medium"
                      />
                    </FieldRow>

                    <FieldRow label="Bio" htmlFor="bio">
                      <input
                        id="bio"
                        name="bio"
                        type="text"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Parle-nous de tes animes préférés"
                        className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right text-xs font-medium"
                      />
                    </FieldRow>

                    <FieldRow label="Téléphone" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+225 00 00 00 00"
                        className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right text-xs font-medium"
                      />
                    </FieldRow>
                  </div>

                  {message.text && (
                    <p
                      className={`text-xs font-medium text-center ${
                        message.type === "success" ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {message.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {loading ? "Mise à jour…" : "Sauvegarder le profil"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* 2. APPARENCE & THÈME */}
            {activeSection === "theme" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 pb-1">
                  <Palette size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-white font-heading">
                    Apparence & Thème
                  </h2>
                </div>

                {/* Couleur des boutons */}
                <div className="rounded-2xl border border-border/80 bg-card/80 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">Couleur des boutons & accents</h3>
                    <span className="flex items-center gap-1 text-[11px] text-yellow-400">
                      <Star size={12} className="fill-yellow-400" />
                      Favori Header
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {THEME_COLORS.map((color) => {
                      const isSelected = accentColor.toLowerCase() === color.hex.toLowerCase();
                      const isFavorite = favoriteColor.toLowerCase() === color.hex.toLowerCase();

                      return (
                        <div
                          key={color.id}
                          onClick={() => handleSelectAccent(color.hex)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/15 text-white"
                              : "border-border/70 bg-background/50 text-muted-foreground hover:text-white hover:border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="size-5 rounded-full shrink-0 flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            >
                              {isSelected && <Check size={11} className="text-white stroke-[3]" />}
                            </span>
                            <span className="text-xs font-medium truncate">{color.name}</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetFavorite(color.hex);
                            }}
                            title={isFavorite ? "Couleur favorite active" : "Définir comme favori"}
                            className={`p-1 rounded-lg transition-colors ${
                              isFavorite
                                ? "text-yellow-400 fill-yellow-400 hover:text-yellow-300"
                                : "text-muted-foreground hover:text-yellow-400"
                            }`}
                          >
                            <Star size={14} className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pipette / couleur libre */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <Pipette size={14} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Couleur libre :</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => handleSelectAccent(e.target.value)}
                        className="size-8 cursor-pointer rounded-lg border border-border/80 bg-transparent p-0.5"
                      />
                      <button
                        type="button"
                        onClick={() => handleSetFavorite(accentColor)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/80 bg-card text-[11px] font-semibold text-muted-foreground hover:text-white hover:border-primary/40 transition-all"
                      >
                        <Star size={11} className={favoriteColor.toLowerCase() === accentColor.toLowerCase() ? "fill-yellow-400 text-yellow-400" : ""} />
                        <span>Favori</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Couleur de fond */}
                <div className="rounded-2xl border border-border/80 bg-card/80 p-4 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-white">Couleur du fond de l&apos;interface</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BACKGROUND_PRESETS.map((preset) => {
                      const isSelected = bgColor.toLowerCase() === preset.bgHex.toLowerCase();

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectBg(preset.bgHex, preset.cardHex)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/15 text-white shadow-sm"
                              : "border-border/70 bg-background/50 text-muted-foreground hover:text-white hover:border-border"
                          }`}
                        >
                          <span
                            className="size-5 rounded-full shrink-0 border border-white/20 flex items-center justify-center shadow-inner"
                            style={{ backgroundColor: preset.bgHex }}
                          >
                            {isSelected && <Check size={11} className="text-white stroke-[3]" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">{preset.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{preset.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pipette / fond libre */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <Pipette size={14} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Fond personnalisé :</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => handleSelectBg(e.target.value)}
                        className="size-8 cursor-pointer rounded-lg border border-border/80 bg-transparent p-0.5"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">{bgColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CONFIDENTIALITÉ (EN COURS DE DÉVELOPPEMENT) */}
            {activeSection === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 pb-1">
                  <ShieldCheck size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-white font-heading">
                    Confidentialité
                  </h2>
                </div>

                <div className="rounded-2xl border border-dashed border-primary/30 bg-card/60 p-8 text-center space-y-3">
                  <div className="flex size-12 mx-auto items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                    <Construction size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Partie en cours de développement 🚧
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Les options de confidentialité avancées (visibilité de la watchlist, masquage de l&apos;activité, compte privé) seront disponibles lors de la prochaine mise à jour de la bêta.
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25">
                    Bientôt disponible
                  </span>
                </div>
              </motion.div>
            )}

            {/* 4. SÉCURITÉ & COMPTE */}
            {activeSection === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 pb-1">
                  <Lock size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-white font-heading">
                    Sécurité & Compte
                  </h2>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card/80 p-4 space-y-4 shadow-sm">
                  {/* Déconnexion */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-white">Session</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Déconnecte-toi en toute sécurité de cet appareil.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/60 py-2.5 text-xs font-bold text-muted-foreground hover:text-white hover:border-primary/40 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Suppression de compte */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-red-400">
                      <AlertTriangle size={14} />
                      <h3 className="text-xs font-bold">Suppression définitive</h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      La suppression effacera définitivement votre profil, vos publications et vos données.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmText("");
                        setDeleteError(null);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={15} />
                      <span>Supprimer mon compte</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ MODALE DE CONFIRMATION DÉCONNEXION ══════════ */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border/80 bg-[#0e1338] p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Déconnexion</h2>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Es-tu sûr de vouloir te déconnecter de ton compte Nekama ?
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-xl bg-primary text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
                >
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ MODALE DE SUPPRESSION DE COMPTE SÉCURISÉE ══════════ */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-red-500/40 bg-[#0e1234] p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle size={18} />
                  <h3 className="text-sm font-bold text-white">Supprimer définitivement</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Cette action est <strong className="text-white">irréversible</strong>. Vos publications, collections et profil seront définitivement effacés de nos serveurs.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">
                  Pour confirmer, tapez <span className="font-bold text-red-400">SUPPRIMER</span> :
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="w-full h-9 px-3 rounded-xl border border-border bg-card/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500"
                />
              </div>

              {deleteError && (
                <p className="text-[11px] text-red-400 font-medium">{deleteError}</p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText.trim() !== "SUPPRIMER" || isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Suppression…" : "Confirmer la suppression"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// SOUS-COMPOSANTS
// ════════════════════════════════════════════════════════════

function FieldRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <label htmlFor={htmlFor} className="shrink-0 text-xs font-semibold text-foreground">
        {label}
      </label>
      <div className="min-w-0 sm:flex-1">{children}</div>
    </div>
  );
}
