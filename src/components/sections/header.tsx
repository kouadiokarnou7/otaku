"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

import { Analytics } from "firebase/analytics";
import { u } from "framer-motion/client";
// ✅ CORRECTION : Définir MotionLink EN DEHORS du composant
const MotionLink = motion(Link);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // 1. Gestion du scroll pour le style de la navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Gestion de la section active (Highlight)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    NAVIGATION.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

 // l'analytique du site 
 

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (href: string) => {
    const id = href.replace("#", "");
    return activeSection === id;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-orange-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 relative">
          
          {/* 1. LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer z-20"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image src={logo} alt="Otaku 225 Logo" width={120} height={50} className="object-contain" priority />
          </motion.div>

          {/* 2. LIENS CENTRÉS AVEC INDICATEUR ACTIF */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAVIGATION.map((item, i) => {
              const active = isActive(item.href);
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollTo(item.href)}
                  className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group ${
                    active ? "text-[#FF6B1A]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute -bottom-2 left-0 h-0.5 bg-[#FF6B1A] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`} 
                  />
                </motion.button>
              );
            })}
          </div>

          {/* 3. BOUTONS D'ACTION (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4 z-20"
          >
            {/* Bouton Commencer */}
            <MotionLink
              href="/feed"
              className="px-10 py-4 rounded-full bg-[#FF6B1A] text-white font-bold text-base flex items-center gap-2 transition-all duration-300 hover:bg-orange-600 shadow-lg shadow-orange-900/20"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 107, 26, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer <ArrowRight size={16} />
            </MotionLink>

            {/* Bouton Se Connecter */}
            <MotionLink
              href="/login"
              className="px-8 py-3 rounded-full border border-[#FF6B1A] text-[#FF6B1A] font-bold text-base flex items-center gap-2 transition-all duration-300"
              whileHover={{ scale: 1.05, backgroundColor: "#FF6B1A", color: "#fff" }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn size={18} /> Se connecter
            </MotionLink>
          </motion.div>

          {/* 4. BURGER MOBILE */}
          <div className="md:hidden z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none hover:text-[#FF6B1A] transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2 flex flex-col items-center">
              {NAVIGATION.map((item) => {
                const active = isActive(item.href);
                return (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    className={`text-lg font-bold w-full py-3 text-center transition-colors ${
                      active ? "text-[#FF6B1A]" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              
              <div className="w-full h-px bg-white/10 my-4" />

              <div className="flex flex-col gap-4 w-full max-w-xs mt-2">
                {/* Lien mobile pour Commencer */}
                <MotionLink
                  href="/feed"
                  className="w-full py-4 rounded-xl bg-[#FF6B1A] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 text-center no-underline"
                  whileTap={{ scale: 0.98 }}
                >
                  Commencer l'aventure <ArrowRight size={18} />
                </MotionLink>
                
                {/* Lien mobile pour Se connecter */}
                <MotionLink
                  href="/login"
                  className="w-full py-4 rounded-xl border border-[#FF6B1A] text-[#FF6B1A] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#FF6B1A] hover:text-white transition-all text-center no-underline"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn size={18} /> Se connecter
                </MotionLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}