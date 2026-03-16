"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Swords } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../../public/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">

          {/* 1. LOGO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer z-20"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Swords className="w-8 h-8 text-[#FF6B1A]" />
            <span className="text-xl font-bold tracking-wider text-white font-display">
              OTAKU <span className="text-[#FF6B1A]">225</span>
            </span>
          </motion.div>

          {/* 2. LIENS CENTRÉS */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAVIGATION.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollTo(item.href)}
                className="text-sm font-medium text-gray-300 hover:text-[#FF6B1A] transition-colors uppercase tracking-wide"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* 3. BOUTON SE CONNECTER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block z-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full border border-[#FF6B1A] text-[#FF6B1A] font-bold text-sm hover:bg-[#FF6B1A] hover:text-white transition-all duration-300"
            >
              Se connecter
            </motion.button>
          </motion.div>

          {/* 4. BURGER MOBILE */}
          <div className="md:hidden z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
            <div className="px-4 pt-2 pb-8 space-y-4 flex flex-col items-center">
              {NAVIGATION.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="text-lg font-medium text-gray-300 hover:text-[#FF6B1A] w-full py-2 text-center"
                >
                  {item.label}
                </button>
              ))}
              <button className="w-full mt-4 py-3 rounded-lg bg-[#FF6B1A] text-white font-bold">
                Se connecter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}