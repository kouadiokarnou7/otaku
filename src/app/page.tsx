"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useRouter } from "next/navigation";
import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import Features from "@/components/sections/features";

import CTASection from "@/components/sections/cta";
import Footer from "@/components/sections/footer";

/**
 * Page d'accueil de Nekama (Landing Page MVP).
 * Structure : Header → Hero → Features → CTA Final → Footer.
 * Redirige automatiquement les utilisateurs connectés vers le feed.
 *
 * @component
 * @returns {JSX.Element} La page d'accueil complète.
 */
export default function HomePage() {
  const { user, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && user) {
      router.push("/feed");
    }
  }, [user, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF3E00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#FF3E00] selection:text-white overflow-hidden transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}