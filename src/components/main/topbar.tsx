"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogIn, LogOut, Moon, Sun, Search, Settings, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { getFavoriteAccentColor } from "@/lib/theme/themeColors";

const MotionLink = motion.create(Link);

interface TopBarProps {
  notifCount?: number;
  onToggleSidebar?: () => void;
}

/**
 * Boutons d'authentification pour les utilisateurs non connectés.
 */
function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <MotionLink
        href="/login"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-1.5 rounded-xl border border-border/80 px-4 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-white hover:border-primary/40 no-underline"
      >
        <LogIn size={14} />
        Se connecter
      </MotionLink>

      <MotionLink
        href="/register"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:bg-violet-600 no-underline"
      >
        <User size={14} />
        Rejoindre
      </MotionLink>
    </div>
  );
}

/**
 * Menu déroulant du profil utilisateur dans le header :
 * Défile Mon profil, Paramètres et Déconnexion.
 */
function ProfileDropdown() {
  const { user, isInitializing, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isInitializing || !user) return null;

  const name = user.displayName || user.email || "Otaku";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Menu du profil"
        className="cursor-pointer block rounded-full focus:outline-none ring-2 ring-transparent hover:ring-primary/50 transition-all"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={name}
            width={34}
            height={34}
            priority
            className="size-8 rounded-full object-cover border border-primary/40 shadow-sm"
            unoptimized
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-md shadow-violet-500/25">
            {initials}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/90 bg-[#0e1338]/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-foreground"
          >
            {/* En-tête de prévisualisation du profil */}
            <div className="px-3 py-2 border-b border-border/60 mb-1.5">
              <p className="text-xs font-bold text-white truncate">{name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>

            {/* Lien Mon profil */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/80 rounded-xl transition-colors no-underline"
            >
              <User size={15} className="text-primary" />
              <span>Mon Profil</span>
            </Link>

            {/* Lien Paramètres */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-card/80 rounded-xl transition-colors no-underline"
            >
              <Settings size={15} className="text-primary" />
              <span>Paramètres</span>
            </Link>

            <div className="h-px bg-border/60 my-1" />

            {/* Action Se déconnecter */}
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={15} />
              <span>Se déconnecter</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Formulaire de recherche générale pour Desktop / Tablette.
 */
function GlobalSearchBar() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-4 hidden md:block">
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 text-muted-foreground pointer-events-none"
        />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Rechercher un anime, un manga..."
          className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/80 bg-card/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
        />
      </div>
    </form>
  );
}

/**
 * Barre de navigation supérieure (TopBar) pour Desktop & Tablette.
 */
export default function TopBar({ notifCount = 0 }: TopBarProps) {
  const pathname = usePathname();
  const { user, isInitializing, logout } = useAuth();
  const isAuth = !!user && !isInitializing;
  const onNotifs = pathname === "/notifications";
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-border/80 bg-background/90 px-6 backdrop-blur-xl transition-colors duration-300">
      {/* ── Logo Nekama ── */}
      <MotionLink
        href="/feed"
        whileHover={{ opacity: 0.85 }}
        whileTap={{ scale: 0.97 }}
        className="flex shrink-0 flex-col no-underline group"
      >
        <span className="font-heading text-lg font-black tracking-tight text-white group-hover:text-primary transition-colors">
          Nekama
        </span>
        <span className="text-[9px] -mt-1 font-medium tracking-widest text-primary/80">
          ネカマ
        </span>
      </MotionLink>

      {/* ── Barre de recherche globale ── */}
      <GlobalSearchBar />

      {/* ── Droite (Actions & Profil) ── */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* Indicateur de couleur favorite / raccourci vers les paramètres */}
        <Link
          href="/settings"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/70 bg-card/60 text-xs font-semibold text-muted-foreground hover:text-white hover:border-primary/50 transition-all no-underline"
          title="Couleur d'accent active — Personnaliser dans Paramètres"
        >
          <span className="size-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          <span className="hidden lg:inline text-[11px] font-medium text-foreground/80">Thème</span>
        </Link>

        {/* Toggle thème clair/sombre */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-all"
          aria-label="Changer de thème"
          title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {!isAuth && <AuthButtons />}

        {isAuth && (
          <>
            <MotionLink
              href="/notifications"
              whileTap={{ scale: 0.9 }}
              aria-label={
                notifCount > 0 ? `Notifications (${notifCount} non lues)` : "Notifications"
              }
              aria-current={onNotifs ? "page" : undefined}
              className={`relative flex size-9 items-center justify-center rounded-xl border transition-colors ${
                onNotifs
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/80 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-white"
              }`}
            >
              <Bell size={18} />
              {notifCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-background bg-[#EF4444] px-1 text-[9px] font-bold text-white shadow-sm">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </MotionLink>

            <div className="h-5 w-px bg-border mx-0.5" />

            {/* Menu déroulant au clic sur l'avatar du profil */}
            <ProfileDropdown />
          </>
        )}
      </div>
    </header>
  );
}
