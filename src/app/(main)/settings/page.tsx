"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ThemeMode = "dark" | "light";

/**
 * Page des paramètres de l'utilisateur.
 * Permet de modifier le profil, l'apparence (thème) et de se déconnecter.
 * Harmonisé avec le design system (Tailwind sémantique, couleur d'accent #FF3E00).
 *
 * @page
 * @returns {JSX.Element | null} La page des paramètres.
 */
export default function SettingsPage() {
  const { user, logout, isInitializing } = useAuth();
  const { profile, formData, handleChange, handleSubmit, loading, message, preview, handleImageSelect } =
    useProfile(user?.uid);
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  // Initialisation du thème depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setThemeMode("light");
    } else {
      setThemeMode("dark");
    }
  }, []);

  /**
   * Applique le thème au document et le persiste.
   * Utilise la classe `.dark` sur `<html>` pour basculer les variables sémantiques.
   */
  const applyTheme = useCallback((mode: ThemeMode) => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
    setThemeMode(mode);
  }, []);

  /**
   * Redirection des visiteurs non connectés.
   */
  useEffect(() => {
    if (!isInitializing && !user) {
      router.replace("/login");
    }
  }, [isInitializing, user, router]);

  /** Déconnexion + fermeture de la modale en cas d'échec. */
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erreur logout:", err);
      setShowLogoutConfirm(false);
    }
  }, [logout]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div
          className="size-8 animate-spin rounded-full border-2 border-border border-t-[#FF3E00]"
          role="status"
          aria-label="Chargement des paramètres"
        />
        <p className="text-sm text-muted-foreground font-medium">Chargement…</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen pb-20 text-foreground bg-background transition-colors duration-300">
      {/* ── Header sticky ── */}
      <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-background/95 px-2 backdrop-blur-md sm:px-4">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 pr-10 text-center text-lg font-black">Paramètres</h1>
      </header>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        {/* ══════════ CARTE PROFIL ══════════ */}
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-[#FF3E00]/40 hover:bg-muted/50 no-underline shadow-sm"
        >
          {profile?.photoURL ? (
            <div className="relative size-14 shrink-0 rounded-full overflow-hidden border border-border">
              <Image
                src={profile.photoURL}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#FF3E00] text-xl font-black text-white shadow-inner">
              {(profile?.displayName || user.email || "U")[0].toUpperCase()}
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-foreground">
              {profile?.displayName || "Mon profil"}
            </span>
            <span className="block truncate text-sm font-medium text-muted-foreground">
              {profile?.username ? `@${profile.username}` : user.email}
            </span>
          </span>

          <ChevronRight size={20} className="shrink-0 text-muted-foreground" />
        </Link>

        {/* ══════════ MON COMPTE ══════════ */}
        <section>
          <SectionLabel>Mon compte</SectionLabel>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            {/* Avatar settings editor */}
            <div className="flex flex-col items-center gap-4 mb-8 mt-2">
              <div className="relative group size-24">
                <div className="size-full rounded-full overflow-hidden border-4 border-background shadow-md bg-muted flex items-center justify-center relative">
                  {preview || profile?.photoURL ? (
                    <Image
                      src={preview || profile?.photoURL || ""}
                      alt="Avatar"
                      fill
                      className="object-cover animate-fade-in"
                      unoptimized
                    />
                  ) : (
                    <span className="text-3xl font-black uppercase text-muted-foreground">
                      {(profile?.displayName || user.email || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar-settings-input"
                  className="absolute bottom-0 right-0 size-8 rounded-full bg-[#FF3E00] flex items-center justify-center cursor-pointer border-2 border-background hover:bg-orange-600 transition-colors shadow-lg hover:scale-105 active:scale-95"
                  title="Changer la photo de profil"
                >
                  <span className="text-sm">📷</span>
                  <input
                    id="avatar-settings-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Photo de profil</p>
            </div>

            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
              <FieldRow label="Pseudo" htmlFor="displayName">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Ton pseudo"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right font-medium"
                />
              </FieldRow>

              <FieldRow label="Bio" htmlFor="bio">
                <input
                  id="bio"
                  name="bio"
                  type="text"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Parle-nous de toi"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right font-medium"
                />
              </FieldRow>

              <FieldRow label="Téléphone" htmlFor="phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+225 …"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground/50 sm:text-right font-medium"
                />
              </FieldRow>

              <FieldRow label="Email">
                <span className="block truncate text-sm font-medium text-muted-foreground sm:text-right">
                  {user.email}
                </span>
              </FieldRow>
            </div>

            {message?.text && (
              <p
                role="status"
                className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium text-center ${
                  message.type === "success"
                    ? "border-green-500/40 bg-green-500/10 text-green-500"
                    : "border-red-500/40 bg-red-500/10 text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#FF3E00] py-3 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 shadow-[0_4px_16px_rgba(255,62,0,0.2)]"
            >
              {loading ? "Mise à jour…" : "Sauvegarder le profil"}
            </button>
          </form>
        </section>

        {/* ══════════ APPARENCE ══════════ */}
        <section>
          <SectionLabel>Apparence</SectionLabel>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <FieldRow label="Thème visuel" htmlFor="theme-mode">
              <div className="flex bg-background border border-border rounded-xl p-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => applyTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    themeMode === "dark" ? "bg-[#FF3E00] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon size={14} /> Sombre
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    themeMode === "light" ? "bg-[#FF3E00] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun size={14} /> Clair
                </button>
              </div>
            </FieldRow>
          </div>
        </section>

        {/* ══════════ PLUS ══════════ */}
        <section>
          <SectionLabel>Plus</SectionLabel>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <LinkRow label="Changer de mot de passe" />
            <LinkRow label="Politique de confidentialité" />
            <FieldRow label="Version">
              <span className="text-sm font-bold text-muted-foreground sm:text-right">1.0.0</span>
            </FieldRow>
          </div>
        </section>

        {/* ── Déconnexion ── */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 py-4 text-center font-bold text-red-500 transition-colors hover:bg-red-500/10 shadow-sm"
        >
          Se déconnecter
        </button>
      </div>

      {/* ══════════ MODALE DE CONFIRMATION ══════════ */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <h2 id="logout-title" className="mb-2 text-xl font-black text-foreground">
                Déconnexion
              </h2>
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                Es-tu sûr de vouloir te déconnecter de ton compte ?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl bg-muted px-4 py-3 font-bold text-foreground transition-all hover:bg-muted/80"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-bold text-white shadow-[0_4px_16px_rgba(239,68,68,0.25)] transition-all hover:bg-red-600"
                >
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
// SOUS-COMPOSANTS DE PRÉSENTATION
// ════════════════════════════════════════════════════════════

/** Intitulé de section, en petites capitales au-dessus d'un groupe. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-wider text-muted-foreground/70">
      {children}
    </p>
  );
}

/** Ligne libellé + contenu. */
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
    <div className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 transition-colors">
      <label
        htmlFor={htmlFor}
        className="shrink-0 text-sm font-bold text-foreground"
      >
        {label}
      </label>
      <div className="min-w-0 sm:flex-1">{children}</div>
    </div>
  );
}

/** Ligne cliquable de type « navigation » (chevron à droite). */
function LinkRow({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted"
    >
      <span className="text-sm font-bold text-foreground">{label}</span>
      <span aria-hidden className="text-xl text-muted-foreground/50">
        <ChevronRight size={18} />
      </span>
    </button>
  );
}
