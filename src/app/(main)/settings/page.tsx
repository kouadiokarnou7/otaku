"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Shield, User, Mail } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, logout, isInitializing } = useAuth();
  const { profile, formData, handleChange, saveProfile, loading } = useProfile(user?.uid);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "about">("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430]">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [primaryColor, setPrimaryColor] = useState("#FF6B1A");

  // Load custom theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("otaku-theme") || "dark";
    const savedPrimary = localStorage.getItem("otaku-primary") || "#FF6B1A";
    setThemeMode(savedTheme as any);
    setPrimaryColor(savedPrimary);
  }, []);

  // Update theme dynamically
  const applyTheme = (tMode: string, pColor: string) => {
    setThemeMode(tMode as any);
    setPrimaryColor(pColor);
    localStorage.setItem("otaku-theme", tMode);
    localStorage.setItem("otaku-primary", pColor);
    
    if (tMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    document.documentElement.style.setProperty("--primary", pColor);
  };

  return (
    <main className="min-h-screen bg-secondary/30 text-foreground pb-20">
      {/* Header Native-like */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 max-h-[60px] flex items-center h-14">
        <div className="flex items-center gap-3 w-full">
          <button onClick={() => router.back()} className="text-primary p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center pr-8">Paramètres</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        {/* Section Profil */}
        <section>
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Mon Compte</p>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden border border-border divide-y divide-border shadow-sm">
            
            {/* Pseudo Row */}
            <div className="flex items-center justify-between p-4 bg-transparent outline-none">
              <span className="font-medium">Pseudo</span>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="text-right text-muted-foreground bg-transparent outline-none flex-1 ml-4"
              />
            </div>
            
            {/* Bio Row */}
            <div className="flex items-center justify-between p-4 bg-transparent outline-none">
              <span className="font-medium whitespace-nowrap">Bio</span>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="text-right text-muted-foreground bg-transparent outline-none flex-1 ml-4 truncate"
              />
            </div>

            {/* Email Row */}
            <div className="flex items-center justify-between p-4 hover:bg-secondary/50 transition">
              <span className="font-medium">Email</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="truncate max-w-[150px] sm:max-w-xs text-sm">{user?.email}</span>
                <span className="text-xl">›</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => saveProfile?.()}
            disabled={loading}
            className="w-full mt-4 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Sauvegarder le profil"}
          </button>
        </section>

        {/* Section Apparence & Thème */}
        <section>
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Apparence</p>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden border border-border divide-y divide-border shadow-sm">
            
            {/* Dark/Light mode */}
            <div className="flex justify-between items-center p-4">
              <span className="font-medium">Thème de Fond</span>
              <select 
                value={themeMode}
                onChange={(e) => applyTheme(e.target.value, primaryColor)}
                className="bg-secondary/50 border border-border rounded-lg text-sm p-1.5 focus:outline-none"
              >
                <option value="dark">Macabre (Noir)</option>
                <option value="light">Épique (Blanc)</option>
              </select>
            </div>
            
            {/* Couleur Primaire */}
            <div className="flex justify-between items-center p-4">
              <span className="font-medium">Couleur Principale</span>
              <div className="flex items-center gap-2">
                {["#FF6B1A", "#3B82F6", "#A855F7", "#10B981"].map((color) => (
                  <button
                    key={color}
                    onClick={() => applyTheme(themeMode, color)}
                    className={`w-8 h-8 rounded-full border-2 ${primaryColor === color ? 'border-foreground shadow-md' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Sécurité & Divers */}
        <section>
          <div className="px-4 mb-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Plus</p>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden border border-border divide-y divide-border shadow-sm">
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition text-left">
              <span className="font-medium">Changer de mot de passe</span>
              <span className="text-xl text-muted-foreground">›</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition text-left">
              <span className="font-medium">Politique de confidentialité</span>
              <span className="text-xl text-muted-foreground">›</span>
            </button>
            <div className="flex justify-between p-4 bg-secondary/10">
              <span className="font-medium">Version</span>
              <span className="text-muted-foreground text-sm">1.0.0</span>
            </div>
          </div>
        </section>

        {/* Déconnexion */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 text-center text-destructive bg-card border border-border rounded-2xl font-bold hover:bg-destructive/10 transition shadow-sm"
        >
          Déconnexion
        </button>
      </div>

      {/* Modal Confirmation Logout */}
      {showLogoutConfirm && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
         >
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
           >
             <h2 className="text-xl font-bold mb-2">Confirmer la déconnexion</h2>
             <p className="text-muted-foreground mb-6">
               Vous allez être déconnecté de votre compte.
             </p>
             <div className="flex gap-3">
               <button
                 onClick={() => setShowLogoutConfirm(false)}
                 className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg font-medium"
               >
                 Annuler
               </button>
               <button
                 onClick={handleLogout}
                 className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-medium"
               >
                 Déconnexion
               </button>
             </div>
           </motion.div>
         </motion.div>
      )}
    </main>
  );
}
