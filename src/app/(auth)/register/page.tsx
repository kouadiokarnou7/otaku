"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import InputField from "@/components/auth/InputField";
import AuthBackground from "@/components/auth/layout";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {registerSchema} from "@/lib/validators"
import {useRegister} from "@/lib/store/auth/signin";
type RegisterForm = z.infer<typeof registerSchema>;

// ── Indicateur de force ──────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const specialCharRegex = /[";:,\/\\&!?\@#$%\*\(\)\-\_\+\=]/;

  const checks = [
    { label: "6 caractères min",    ok: password.length >= 6          },
    { label: "Une majuscule",        ok: /[A-Z]/.test(password)        },
    { label: "Un chiffre",           ok: /[0-9]/.test(password)        },
    { label: "Caractère spécial",    ok: specialCharRegex.test(password)},
    { label: "Pas d'espaces",        ok: !/\s/.test(password)           },
  ];

  const score  = checks.filter((c) => c.ok).length;
  const color  = score >= 5 ? "#2ecc71" : score >= 3 ? "#f39c12" : "#dc3535";
  const label  = score >= 5 ? "Fort"    : score >= 3 ? "Moyen"   : "Faible";
  
  


  return (
    <div style={{ padding:"8px 10px", background:"rgba(0,0,0,0.2)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display:"flex", gap:4, marginBottom:8 }}>
        {[1,2,3,4,5].map((i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= score ? color : "rgba(255,255,255,0.1)", transition:"background .3s" }} />
        ))}
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {checks.map((c) => (
          <span key={c.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color: c.ok ? "#2ecc71" : "rgba(255,255,255,0.3)", fontWeight: c.ok ? 600 : 400, transition:"color .2s" }}>
            <Check size={10} strokeWidth={4} style={{ color: c.ok ? color : "currentColor" }} />
            {c.label}
          </span>
        ))}
      </div>
      <div style={{ textAlign:"right", marginTop:6, fontSize:11, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.5px" }}>
        Force : {label}
      </div>
    </div>
  );
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

// ── Page Register ────────────────────────────────────────────
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  //
  const {
    registerdata,
    registerWithGoogle, // 👈 AJOUT IMPORTANT
    loading,
    error,} = useRegister();
  const passwordValue = watch("password") ?? "";

   const onSubmit = async ( data: RegisterForm ) => {
    try {
      
      await registerdata({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      // ✅ La redirection est gérée dans le hook
    } catch (err) {
      // ❌ L'erreur est déjà affichée via authError
      console.error("Registration failed:", err);
    }
  };
  const handleGoogleClick = async () => {
    try {
     
      await registerWithGoogle();
    } catch (err) {
      console.error("Google auth failed:", err);
    }
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
        style={{ width:"100%", maxWidth:440, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"36px 32px", backdropFilter:"blur(20px)", position:"relative", zIndex:1 }}
      >
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28 }}>
          
          <Image src={logo} alt="Otaku 225 Logo" width={120} height={50} className="object-contain" priority />
        </div>

        {/* Titre */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6, letterSpacing:-.3 }}>
            Rejoins la communauté 🎌
          </h1>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.5 }}>
            Crée ton compte et sois parmi les fondateurs
          </p>
        </div>

        {/* Google */}
        <motion.button
          type="button"
          onClick={handleGoogleClick}
          whileHover={{ background:"rgba(31, 30, 30, 0.07)", borderColor:"rgba(255,255,255,0.2)" }}
          whileTap={{ scale:.97 }}
          style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:20, transition:"all .2s" }}
        >
          <GoogleIcon />
          Continuer avec Google
        </motion.button>

        {/* Séparateur */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>OU</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }} />
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display:"flex", flexDirection:"column", gap:16 }} noValidate>

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

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
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

          <p style={{ fontSize:11, color:"rgba(255,255,255,0.25)", lineHeight:1.6, textAlign:"center" }}>
            En créant un compte, tu acceptes nos{" "}
            <Link href="#" style={{ color:"rgba(255,107,26,0.7)", textDecoration:"none" }}>CGU</Link>
            {" "}et notre{" "}
            <Link href="#" style={{ color:"rgba(255,107,26,0.7)", textDecoration:"none" }}>Politique de confidentialité</Link>.
          </p>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(255,107,26,0.35)" }}
            whileTap={{ scale:.97 }}
            style={{ width:"100%", padding:"13px", borderRadius:10, border:"none", background: isSubmitting ? "rgba(255,107,26,0.4)" : "#FF6B1A", color:"#fff", fontSize:14, fontWeight:800, cursor: isSubmitting ? "not-allowed" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s" }}
          >
            {isSubmitting ? (
              <>
                <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                Création du compte...
              </>
            ) : (
              <>Créer mon compte <ArrowRight size={15} /></>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.35)", marginTop:22 }}>
          Déjà membre ?{" "}
          <Link href="/login"
            style={{ color:"#FF6B1A", fontWeight:700, textDecoration:"none" }}
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