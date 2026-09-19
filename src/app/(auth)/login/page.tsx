"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LogIn, Swords, Mail, CheckCircle2, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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

  const { loading, error, loginWithCredentials, loginWithGoogle, resetPassword } = useLogin();

  // État du modal de mot de passe oublié
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingForgot, setIsSendingForgot] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const identifierValue = watch("identifier") ?? "";
  const identifierType = detectIdentifierType(identifierValue);

  const openForgotPasswordModal = () => {
    if (identifierType === "email") {
      setForgotEmail(identifierValue);
    }
    setForgotSuccess(false);
    setForgotError(null);
    setIsForgotOpen(true);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const cleanEmail = forgotEmail.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setForgotError("Veuillez saisir une adresse email valide.");
      return;
    }

    setIsSendingForgot(true);
    try {
      await resetPassword(cleanEmail);
      setForgotSuccess(true);
      toast.success("Email de réinitialisation envoyé ! Vérifie ta boîte de réception.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email.";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setIsSendingForgot(false);
    }
  };

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
            <button
              type="button"
              onClick={openForgotPasswordModal}
              className="text-[11px] text-[#FF3E00]/80 hover:text-[#FF3E00] hover:underline transition-colors font-medium cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || loading}
            whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(255,62,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-[#FF3E00] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mt-1 cursor-pointer"
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
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm font-semibold transition-all hover:bg-muted/60 hover:border-border mb-5 cursor-pointer"
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

      {/* Modal Mot de passe oublié */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl p-6 sm:p-7 z-10"
            >
              {/* Bouton fermer */}
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>

              {forgotSuccess ? (
                <div className="text-center py-4 flex flex-col items-center">
                  <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Vérifie ta boîte de réception
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-xs">
                    Un email contenant un lien pour réinitialiser ton mot de passe a été envoyé à{" "}
                    <span className="font-semibold text-foreground">{forgotEmail}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="size-10 rounded-xl bg-[#FF3E00]/10 border border-[#FF3E00]/20 text-[#FF3E00] flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Mot de passe oublié ?
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Reçois un lien de réinitialisation sécurisé.
                      </p>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Adresse email du compte
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="nakama@exemple.com"
                      autoFocus
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background/50 border border-border text-foreground text-xs focus:outline-none focus:border-[#FF3E00] focus:ring-1 focus:ring-[#FF3E00] transition-colors"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Si tu utilisais un pseudo, indique l&apos;adresse email liée à ce compte.
                    </p>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingForgot}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF3E00] text-white text-xs font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF3E00]/20"
                    >
                      {isSendingForgot ? (
                        <>
                          <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        "Envoyer le lien"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
