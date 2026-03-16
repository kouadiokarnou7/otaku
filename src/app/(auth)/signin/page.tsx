"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Swords, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";

// ── Schéma Zod ───────────────────────────────────────────────
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Le pseudo est requis")
      .min(3, "Minimum 3 caractères")
      .max(15, "Maximum 15 caractères")
      .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Format d'email invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(6, "Minimum 6 caractères")
      .max(50, "Maximum 50 caractères") // Augmenté un peu pour permettre les phrases de passe
      .regex(/[A-Z]/, "Au moins une majuscule (A-Z)")
      .regex(/[0-9]/, "Au moins un chiffre (0-9)")
      // CORRECTION : On autorise explicitement les caractères spéciaux courants
      // Cette regex vérifie qu'il y a AU MOINS un caractère spécial parmi la liste
      .regex(/[";:,\/\\&!?\@#$%\*\(\)\-\_\+\=]/, "Au moins un caractère spécial (; , / & ! ? etc.)")
      .regex(/^\S*$/, "Aucun espace autorisé"),
    confirmPassword: z
      .string()
      .min(1, "Confirme ton mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

// ── Indicateur de force du mot de passe ─────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  // Liste des caractères spéciaux autorisés pour la vérification visuelle
  const specialCharRegex = /[";:,\/\\&!?\@#$%\*\(\)\-\_\+\=]/;

  const checks = [
    { label: "6 caractères min", ok: password.length >= 6 },
    { label: "Une majuscule", ok: /[A-Z]/.test(password) },
    { label: "Un chiffre", ok: /[0-9]/.test(password) },
    { label: "Caractère spécial", ok: specialCharRegex.test(password) }, // CORRECTION ICI
    { label: "Pas d'espaces", ok: !/\s/.test(password) },
  ];

  // Score sur 5 critères
  const score = checks.filter((c) => c.ok).length;
  
  // Couleurs adaptées au score (Rouge -> Orange -> Vert)
  let color = "#dc3535"; // Faible
  let label = "Faible";
  
  if (score >= 3) { color = "#f39c12"; label = "Moyen"; }
  if (score >= 5) { color = "#2ecc71"; label = "Fort"; }

  return (
    <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Barres de progression */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= score ? color : "rgba(255,255,255,0.1)",
              transition: "background .3s ease",
            }}
          />
        ))}
      </div>
      
      {/* Checklist détaillée */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {checks.map((c) => (
          <span
            key={c.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              color: c.ok ? "#2ecc71" : "rgba(255,255,255,0.3)",
              transition: "color .2s",
              fontWeight: c.ok ? 600 : 400,
            }}
          >
            <Check size={10} strokeWidth={4} style={{ color: c.ok ? color : "currentColor" }} />
            {c.label}
          </span>
        ))}
      </div>
      
      {/* Label global (Faible/Moyen/Fort) */}
      <div style={{ textAlign: "right", marginTop: 6, fontSize: 11, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Force : {label}
      </div>
    </div>
  );
}

// ── Google Icon ──────────────────────────────────────────────
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

// ── Page Register ────────────────────────────────────────────
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password") ?? "";

  const onSubmit = async (data: RegisterForm) => {
    console.log("Register data:", data);
    await new Promise((r) => setTimeout(r, 1200));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* Halos de fond */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,26,0.06),transparent 60%)", top: -120, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,26,0.03),transparent 65%)", bottom: -60, right: -40, pointerEvents: "none" }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", maxWidth: 440, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(20px)", position: "relative", zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          <Swords size={22} color="#FF6B1A" />
          <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
            OTAKU <span style={{ color: "#FF6B1A" }}>225</span>
          </span>
        </div>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6, letterSpacing: -0.3 }}>
            Rejoins la communauté 🎌
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
            Crée ton compte et sois parmi les fondateurs
          </p>
        </div>

        {/* Bouton Google */}
        <motion.button
          type="button"
          whileHover={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.97 }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 20, transition: "all .2s" }}
        >
          <GoogleIcon />
          Continuer avec Google
        </motion.button>

        {/* Séparateur */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>OU</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>
          <InputField
            label="Pseudo"
            type="text"
            placeholder="ton_pseudo_otaku"
            registration={register("username")}
            error={errors.username?.message}
            autoComplete="username"
          />

          <InputField
            label="Email"
            type="email"
            placeholder="ton@email.com"
            registration={register("email")}
            error={errors.email?.message}
            autoComplete="email"
          />

          {/* Mot de passe + indicateur */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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

          {/* CGU */}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6, textAlign: "center" }}>
            En créant un compte, tu acceptes nos{" "}
            <Link href="#" style={{ color: "rgba(255,107,26,0.7)", textDecoration: "none" }}>CGU</Link>
            {" "}et notre{" "}
            <Link href="#" style={{ color: "rgba(255,107,26,0.7)", textDecoration: "none" }}>Politique de confidentialité</Link>.
          </p>

          {/* Bouton submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(255,107,26,0.35)" }}
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: isSubmitting ? "rgba(255,107,26,0.4)" : "#FF6B1A", color: "#fff", fontSize: 14, fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .2s" }}
          >
            {isSubmitting ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                Création du compte...
              </>
            ) : (
              <>
                Créer mon compte <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        {/* Lien connexion */}
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 22 }}>
          Déjà membre ?{" "}
          <Link href="/login" style={{ color: "#FF6B1A", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            Se connecter
          </Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}