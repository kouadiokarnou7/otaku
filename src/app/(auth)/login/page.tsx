"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Swords } from "lucide-react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";
import AuthBackground from "@/components/auth/layout";
import { loginSchema } from "@/lib/validators";
import { useLogin } from "@/lib/hooks/store/auth/login";

type LoginForm = z.infer<typeof loginSchema>;

/**
 * Détecte si l'identifiant saisi est un email ou un pseudo.
 * Utilisé pour afficher un badge visuel contextuel.
 *
 * @param {string} value - La saisie de l'utilisateur.
 * @returns {"email" | "pseudo" | null} Le type détecté ou null si la saisie est trop courte/vide.
 */
function detectIdentifierType(value: string): "email" | "pseudo" | null {
  if (!value) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (value.length >= 3) return "pseudo";
  return null;
}

/**
 * Icône SVG du logo Google pour le bouton de connexion SSO.
 *
 * @component
 * @returns {JSX.Element} L'icône SVG Google.
 */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.6l6.2 5.2C40.8 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

/**
 * Page de connexion d'Otaku225.
 * Interface en glassmorphism avec détection de type d'identifiant en temps réel,
 * connexion par email/pseudo + mot de passe, et SSO Google.
 * Utilise les variables sémantiques Tailwind pour s'adapter au thème.
 *
 * @page
 * @returns {JSX.Element} La page de connexion complète.
 */
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const { loading, error, loginWithCredentials, loginWithGoogle } = useLogin();

  const identifierValue = watch("identifier") ?? "";
  const identifierType = detectIdentifierType(identifierValue);

  /**
   * Traite la soumission du formulaire d'authentification.
   *
   * @param {LoginForm} data - Les données du formulaire validées par Zod.
   */
  const onSubmit = async (data: LoginForm) => {
    try {
      await loginWithCredentials(data.identifier, data.password);
    } catch (err) {
      console.error("❌ Échec de la connexion :", err);
    }
  };

  return (
    <main className="min-h-svh flex items-center justify-center p-6 relative overflow-hidden">

      {/* Fond animé partagé */}
      <AuthBackground />

      {/* Card principale */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-card/60 border border-border rounded-2xl p-8 sm:p-9 backdrop-blur-xl relative z-10 transition-colors duration-300"
      >

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <Swords size={18} className="text-[#FF3E00]" />
          <span className="font-display text-lg font-black tracking-wide text-foreground">
            NETAKAMA
          </span>
        </div>

        {/* Titre */}
        <div className="text-center mb-7">
          <h1 className="text-xl font-black text-foreground tracking-tight mb-1.5">
            Bon retour, Nakama 👋
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Connecte-toi pour retrouver ta communauté
          </p>
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

          <div className="relative">
            <InputField
              label="Identifiant"
              type="text"
              placeholder="ton@email.com ou ton_pseudo"
              registration={register("identifier")}
              error={errors.identifier?.message}
              autoComplete="username"
            />
            {identifierType && !errors.identifier && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute top-0 right-0 text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full border ${
                  identifierType === "email"
                    ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/10"
                    : "text-[#FF3E00] border-[#FF3E00]/30 bg-[#FF3E00]/10"
                }`}
              >
                {identifierType === "email" ? "Email ✓" : "Pseudo ✓"}
              </motion.span>
            )}
          </div>

          <InputField
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            registration={register("password")}
            error={errors.password?.message}
            autoComplete="current-password"
          />

          <div className="text-right -mt-2">
            <Link
              href="#"
              className="text-[11px] text-[#FF3E00]/70 hover:text-[#FF3E00] transition-colors no-underline font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || loading}
            whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(255,62,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-[#FF3E00] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isSubmitting || loading ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </>
            ) : (
              <>Se connecter <ArrowRight size={15} /></>
            )}
          </motion.button>
        </form>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground tracking-[0.08em] uppercase font-medium">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google SSO */}
        <motion.button
          type="button"
          onClick={() => loginWithGoogle()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm font-semibold transition-all hover:bg-muted/60 hover:border-border mb-5"
        >
          <GoogleIcon />
          Continuer avec Google
        </motion.button>

        {/* Lien inscription */}
        <p className="text-center text-xs text-muted-foreground">
          Pas encore membre ?{" "}
          <Link
            href="/register"
            className="font-bold text-[#FF3E00] hover:underline no-underline"
          >
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
