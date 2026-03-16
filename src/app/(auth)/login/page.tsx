"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";
import AuthBackground from "@/components/auth/layout";

// ── Schéma Zod ───────────────────────────────────────────────
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "L'email ou le pseudo est requis")
    .refine(
      (val) => {
        const isEmail    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isUsername = val.length >= 3 && /^[a-zA-Z0-9_]+$/.test(val);
        return isEmail || isUsername;
      },
      { message: "Entrez un email valide ou un pseudo (min. 3 caractères)" }
    ),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Minimum 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

function detectIdentifierType(value: string): "email" | "pseudo" | null {
  if (!value) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (value.length >= 3) return "pseudo";
  return null;
}

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

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const identifierValue = watch("identifier") ?? "";
  const identifierType  = detectIdentifierType(identifierValue);

  const onSubmit = async (data: LoginForm) => {
    // TODO : Firebase Auth
    console.log("Login:", { ...data, detectedAs: identifierType });
    await new Promise((r) => setTimeout(r, 1000));
  };

  return (
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", position:"relative", overflow:"hidden" }}>

      {/* Fond animé partagé + bouton retour */}
      <AuthBackground />

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:24, scale:.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.55, ease:[.16,1,.3,1] }}
        style={{ width:"100%", maxWidth:420, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"36px 32px", backdropFilter:"blur(20px)", position:"relative", zIndex:1 }}
      >
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
          <span style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:1 }}>
            OTAKU <span style={{ color:"#FF6B1A" }}>225</span>
          </span>
        </div>

        {/* Titre */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6, letterSpacing:-.3 }}>
            Bon retour, Nakama 👋
          </h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.5 }}>
            Connecte-toi pour retrouver ta communauté
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:16 }} noValidate>

          <div style={{ position:"relative" }}>
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
                initial={{ opacity:0, scale:.8 }}
                animate={{ opacity:1, scale:1 }}
                style={{
                  position:"absolute", top:0, right:0,
                  fontSize:9, fontWeight:700, letterSpacing:"0.08em",
                  textTransform:"uppercase", padding:"3px 8px",
                  borderRadius:99, border:"1px solid",
                  color:       identifierType === "email" ? "#00D4FF" : "#FF6B1A",
                  borderColor: identifierType === "email" ? "rgba(0,212,255,0.35)" : "rgba(255,107,26,0.35)",
                  background:  identifierType === "email" ? "rgba(0,212,255,0.08)" : "rgba(255,107,26,0.08)",
                }}
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

          <div style={{ textAlign:"right", marginTop:-8 }}>
            <Link href="#"
              style={{ fontSize:12, color:"rgba(255,107,26,0.7)", textDecoration:"none", transition:"color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FF6B1A")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,107,26,0.7)")}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(255,107,26,0.35)" }}
            whileTap={{ scale:.97 }}
            style={{ width:"100%", padding:"13px", borderRadius:10, border:"none", background: isSubmitting ? "rgba(255,107,26,0.4)" : "#FF6B1A", color:"#fff", fontSize:14, fontWeight:800, cursor: isSubmitting ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s", marginTop:4 }}
          >
            {isSubmitting ? (
              <>
                <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                Connexion...
              </>
            ) : (
              <>Se connecter <ArrowRight size={15} /></>
            )}
          </motion.button>
        </form>

        {/* Séparateur */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>OU</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
        </div>

        <motion.button
          type="button"
          whileHover={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.2)" }}
          whileTap={{ scale:.97 }}
          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:20, transition:"all .2s" }}
        >
          <GoogleIcon />
          Continuer avec Google
        </motion.button>

        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.35)", marginTop:0 }}>
          Pas encore membre ?{" "}
          <Link href="/register"
            style={{ color:"#FF6B1A", fontWeight:700, textDecoration:"none" }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            Créer un compte
          </Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}