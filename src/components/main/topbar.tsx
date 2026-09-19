"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, User, LogIn, Moon, Sun, Search } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/store/auth/useauth";

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
 * Avatar dynamique de l'utilisateur connecté.
 */
function ProfileAvatar() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) return null;

  const name = user.displayName || user.email || "U";
  const initials = name.slice(0, 2).toUpperCase();

  if (user.photoURL) {
    return (
      <MotionLink href="/profile" whileHover={{ scale: 1.05 }} className="cursor-pointer block no-underline">
        <Image
          src={user.photoURL}
          alt={name}
          width={32}
          height={32}
          priority
          className="size-8 rounded-full object-cover border border-primary/40"
          unoptimized
        />
      </MotionLink>
    );
  }

  return (
    <MotionLink
      href="/profile"
      whileHover={{ scale: 1.05 }}
      title={name}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-md shadow-violet-500/25 no-underline"
    >
      {initials}
    </MotionLink>
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
  const { user, isInitializing } = useAuth();
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
    <header className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b border-border/80 bg-[#0a0e27]/90 px-6 backdrop-blur-xl transition-colors duration-300">
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

      {/* ── Droite (Actions) ── */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Toggle thème */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-all"
          aria-label="Changer de thème"
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

            <div className="h-5 w-px bg-border mx-1" />

            <ProfileAvatar />
          </>
        )}
      </div>
    </header>
  );
}
