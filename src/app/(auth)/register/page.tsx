"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ArrowLeft, Swords, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import InputField from "@/components/auth/InputField";
import AuthBackground from "@/components/auth/layout";
import { registerSchema } from "@/lib/validators";
import { useRegister } from "@/lib/hooks/store/auth/signin";

type RegisterForm = z.infer<typeof registerSchema>;

/**
 * Composant de présentation affichant la force du mot de passe.
 * Évalue 5 critères de sécurité et colore une jauge en conséquence.
 *
 * @component
 * @param {object} props - Propriétés du composant.
 * @param {string} props.password - Le mot de passe à évaluer.
 * @returns {JSX.Element | null} Le composant graphique d'évaluation ou null si le champ est vide.
 */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const specialCharRegex = /[";:,\/\\&!?\@#$%\*\(\)\-\_\+\=]/;

  const checks = [
    { label: "6 caractères min", ok: password.length >= 6 },
    { label: "Une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Un chiffre", ok: /[0-9]/.test(password) },
    { label: "Caractère spécial", ok: specialCharRegex.test(password) },
    { label: "Pas d'espaces", ok: !/\s/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const color = score >= 5 ? "#2ecc71" : score >= 3 ? "#f39c12" : "#ef4444";
  const label = score >= 5 ? "Fort" : score >= 3 ? "Moyen" : "Faible";

  return (
    <div className="p-2.5 bg-muted/30 rounded-xl border border-border">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= score ? color : "var(--border)" }}
          />
        ))}
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1.5 text-[10px] transition-colors duration-200 ${
              c.ok ? "text-green-500 font-semibold" : "text-muted-foreground/60"
            }`}
          >
            <Check size={10} strokeWidth={4} style={{ color: c.ok ? color : "currentColor" }} />
            {c.label}
          </span>
        ))}
      </div>
      <div
        className="text-right mt-1.5 text-[11px] font-bold uppercase tracking-wide"
        style={{ color }}
      >
        Force : {label}
      </div>
    </div>
  );
}

/**
 * Composant de présentation affichant l'icône Google en SVG.
 *
 * @component
 * @returns {JSX.Element} L'icône SVG du logo Google.
 */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.6l6.2 5.2C40.8 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  );
}

/**
 * Page d'inscription (Register Page) d'Otaku225.
 * Propose une interface d'inscription progressive en 3 étapes :
 * - Étape 1 : Saisie de l'Email et du Pseudo.
 * - Étape 2 : Saisie du Mot de passe et de la Confirmation.
 * - Étape 3 : Photo de profil (Optionnel) avec option de skip.
 * Utilise les variables sémantiques Tailwind pour s'adapter au thème clair/sombre.
 *
 * @page
 * @returns {JSX.Element} L'élément JSX rendu de la page d'inscription.
 */
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  /**
   * Gère la sélection de fichier pour la photo de profil (Avatar).
   * Lit le fichier sélectionné et génère une URL de prévisualisation en Base64.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - L'événement de changement d'input fichier.
   */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Efface la photo de profil sélectionnée ainsi que sa prévisualisation.
   */
  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const { registerdata, registerWithGoogle, error } = useRegister();

  const passwordValue = watch("password") ?? "";

  /**
   * Gère la validation de l'étape 1 (Email & Pseudo) et le passage à l'étape 2.
   */
  const handleStep1Next = async () => {
    const isValid = await trigger(["email", "username"]);
    if (isValid) {
      setStep(2);
    }
  };

  /**
   * Gère la validation de l'étape 2 (Mots de passe) et le passage à l'étape 3.
   */
  const handleStep2Next = async () => {
    const isValid = await trigger(["password", "confirmPassword"]);
    if (isValid) {
      setStep(3);
    }
  };

  /**
   * Traite la soumission finale du formulaire d'inscription.
   * Transmet les données de compte et le fichier d'avatar optionnel au hook d'authentification.
   *
   * @param {RegisterForm} data - Les données du formulaire validées et typées.
   */
  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerdata(
        {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
        avatarFile
      );
    } catch (err) {
      console.error("❌ Échec de la création de compte :", err);
    }
  };

  /**
   * Gère le clic d'authentification et création de compte avec Google.
   */
  const handleGoogleClick = async () => {
    try {
      await registerWithGoogle();
    } catch (err) {
      console.error("❌ Échec authentification Google :", err);
    }
  };

  /**
   * Finalise l'inscription sans photo de profil (Skip).
   */
  const handleSkipAvatar = () => {
    clearAvatar();
    handleSubmit(onSubmit)();
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
        className="w-full max-w-[440px] bg-card/60 border border-border rounded-2xl p-8 sm:p-9 backdrop-blur-xl relative z-10 transition-colors duration-300"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <Swords size={18} className="text-[#FF3E00]" />
          <span className="font-display text-lg font-black tracking-wide text-foreground">
            NETAKAMA
          </span>
        </div>

        {/* Titre & Étape */}
        <div className="text-center mb-7">
          <h1 className="text-xl font-black text-foreground tracking-tight mb-1.5">
            Rejoins la communauté 🎌
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {step === 1 && "Étape 1 sur 3 : Qui es-tu ?"}
            {step === 2 && "Étape 2 sur 3 : Sécurise ton compte"}
            {step === 3 && "Étape 3 sur 3 : Personnalise ton profil"}
          </p>
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Formulaire principal */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <AnimatePresence mode="wait">
            {step === 1 && (
              /* ================= ÉTAPE 1 : EMAIL & PSEUDO ================= */
              <motion.div
                key="step-email-pseudo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <InputField
                  label="Email"
                  type="email"
                  placeholder="ton@email.com"
                  registration={register("email")}
                  error={errors.email?.message}
                  autoComplete="email"
                />

                <InputField
                  label="Pseudo"
                  type="text"
                  placeholder="ton_pseudo_otaku"
                  registration={register("username")}
                  error={errors.username?.message}
                  autoComplete="username"
                />

                <motion.button
                  type="button"
                  onClick={handleStep1Next}
                  whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(255,62,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-[#FF3E00] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-orange-600 mt-2"
                >
                  Continuer <ArrowRight size={15} />
                </motion.button>

                {/* Google Sign-in */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] text-muted-foreground tracking-[0.08em] uppercase font-medium">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <motion.button
                  type="button"
                  onClick={handleGoogleClick}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm font-semibold transition-all hover:bg-muted/60 hover:border-border"
                >
                  <GoogleIcon />
                  Continuer avec Google
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              /* ================= ÉTAPE 2 : MOTS DE PASSE ================= */
              <motion.div
                key="step-passwords"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Bouton Retour */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start pb-2"
                >
                  <ArrowLeft size={14} /> Retour à l'étape 1
                </button>

                <div className="flex flex-col gap-2.5">
                  <InputField
                    label="Mot de passe"
                    type="password"
                    placeholder="Ex: Naruto225!"
                    registration={register("password")}
                    error={errors.password?.message}
                    autoComplete="new-password"
                  />
                  <PasswordStrength password={passwordValue} />
                </div>

                <InputField
                  label="Confirmer le mot de passe"
                  type="password"
                  placeholder="Répète ton mot de passe"
                  registration={register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />

                <motion.button
                  type="button"
                  onClick={handleStep2Next}
                  whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(255,62,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-[#FF3E00] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-orange-600 mt-2"
                >
                  Continuer <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            )}

            {step === 3 && (
              /* ================= ÉTAPE 3 : AVATAR ET CRÉATION COMPTE ================= */
              <motion.div
                key="step-avatar"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Bouton Retour */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start pb-2"
                >
                  <ArrowLeft size={14} /> Retour à l'étape 2
                </button>

                {/* Avatar Upload */}
                <div className="flex flex-col gap-2 items-center mb-2">
                  <span className="text-xs font-bold text-foreground/80 self-start">Photo de profil</span>
                  <div className="flex gap-4 items-center w-full">
                    <div className="relative size-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30 shrink-0">
                      {avatarPreview ? (
                        <Image src={avatarPreview} alt="Preview" fill className="object-cover" unoptimized />
                      ) : (
                        <User className="text-muted-foreground size-8" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        id="avatar-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-foreground text-xs font-semibold cursor-pointer text-center transition-all hover:bg-muted"
                      >
                        Choisir une photo
                      </label>
                      {avatarFile && (
                        <button
                          type="button"
                          onClick={clearAvatar}
                          className="text-[11px] text-red-500 hover:text-red-400 font-medium underline transition-colors self-center"
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton de validation finale */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(255,62,0,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-[#FF3E00] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    <>Finaliser mon inscription <ArrowRight size={15} /></>
                  )}
                </motion.button>

                {/* Bouton Passer (Skip) */}
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={handleSkipAvatar}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline font-medium self-center mt-1"
                  >
                    Passer cette étape (Skip)
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-muted-foreground leading-relaxed text-center mt-2">
            En créant un compte, tu acceptes nos{" "}
            <Link href="#" className="text-[#FF3E00]/80 hover:text-[#FF3E00] hover:underline transition-colors">CGU</Link>
            {" "}et notre{" "}
            <Link href="#" className="text-[#FF3E00]/80 hover:text-[#FF3E00] hover:underline transition-colors">Politique de confidentialité</Link>.
          </p>
        </form>

        {/* Déjà membre ? */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Déjà membre ?{" "}
          <Link
            href="/login"
            className="font-bold text-[#FF3E00] hover:underline no-underline"
          >
            Se connecter
          </Link>
        </p>
      </motion.div>
    </main>
  );
}