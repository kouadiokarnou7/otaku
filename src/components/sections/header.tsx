"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogIn, Swords, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/store/auth/useauth";

const MotionLink = motion.create(Link);

/**
 * Header flottant de Nekama.
 * Barre suspendue en forme de pilule avec sélecteur de thème Jour/Nuit.
 * Utilise les variables sémantiques Tailwind (`bg-background`, `text-foreground`)
 * pour basculer automatiquement entre les thèmes.
 *
 * @component
 * @returns {JSX.Element} La barre de navigation.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { user, isInitializing } = useAuth();
  const isAuth = !!user && !isInitializing;

  /** Détecte le thème actif au premier chargement. */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  /** Alterne entre le thème Jour (Light) et Nuit (Dark). */
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

  /** Ajoute un fond flou quand on scrolle. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-4xl w-full rounded-2xl border transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border shadow-lg"
            : "bg-background/30 backdrop-blur-md border-transparent"
        }`}
      >
        <div className="px-5 h-14 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Swords size={18} className="text-[#FF3E00]" />
            <span className="font-display text-base font-black tracking-wide text-foreground">
              NETAKAMA
            </span>
          </Link>

          {/* ── Desktop : liens + actions ── */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors no-underline">
              Fonctionnalités
            </a>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-border hover:bg-muted text-foreground transition-all"
              aria-label="Changer de thème"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {isAuth ? (
              <>
                <MotionLink
                  href="/feed"
                  className="px-4 py-2 rounded-xl bg-[#FF3E00] text-white text-xs font-bold no-underline transition-all hover:bg-orange-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Mon Réseau
                </MotionLink>
                <Link href="/profile" className="relative size-7 rounded-full overflow-hidden border border-[#FF3E00] shrink-0">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="Avatar" fill sizes="28px" className="object-cover" unoptimized />
                  ) : (
                    <div className="size-full bg-[#FF3E00] flex items-center justify-center text-white text-[9px] font-bold">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors no-underline flex items-center gap-1">
                  <LogIn size={13} /> Se connecter
                </Link>
                <MotionLink
                  href="/register"
                  className="px-5 py-2 rounded-xl bg-[#FF3E00] text-white text-xs font-bold no-underline flex items-center gap-1.5 transition-all hover:bg-orange-600"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Rejoindre <ArrowRight size={12} />
                </MotionLink>
              </>
            )}
          </div>

          {/* ── Mobile : toggle + burger ── */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-1.5 rounded-full border border-border text-foreground" aria-label="Thème">
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-foreground hover:text-[#FF3E00] transition-colors">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Menu mobile ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-background/95 rounded-b-2xl overflow-hidden"
            >
              <div className="px-5 py-5 space-y-3 flex flex-col">
                <a href="#features" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-muted-foreground no-underline">
                  Fonctionnalités
                </a>
                {isAuth ? (
                  <Link href="/feed" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl bg-[#FF3E00] text-white font-bold text-sm text-center no-underline">
                    Mon Réseau
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl border border-border text-foreground font-bold text-sm text-center no-underline flex items-center justify-center gap-2">
                      <LogIn size={14} /> Se connecter
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl bg-[#FF3E00] text-white font-bold text-sm text-center no-underline flex items-center justify-center gap-2">
                      Rejoindre <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}