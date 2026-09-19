"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Sparkles, Flame, Film, BookOpen, Users, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAnimeSearch } from "@/lib/hooks/search/useAnimeSearch";
import type { JikanAnime } from "@/lib/api/jikan";

type FilterTab = "anime" | "manga" | "creators";

export default function SearchDiscoveryPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const {
    query,
    setQuery,
    results,
    trending,
    topAnimes,
    loading,
    trendingLoading,
    search,
  } = useAnimeSearch();

  const [activeTab, setActiveTab] = useState<FilterTab>("anime");
  const [filterOpen, setFilterOpen] = useState(false);

  // Déclencher la recherche si un paramètre "q" est présent dans l'URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery);
    }
  }, [initialQuery, setQuery, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-6 pb-24">
      {/* ── 1. Barre de Recherche avec Icône Filtre (Écran 2) ── */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search size={16} className="absolute left-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length > 2) {
                search(e.target.value.trim());
              }
            }}
            placeholder="Rechercher un anime, manga..."
            className="w-full h-11 pl-10 pr-10 rounded-2xl border border-border/80 bg-card/80 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 text-xs text-muted-foreground hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex size-11 items-center justify-center rounded-2xl border transition-all ${
            filterOpen
              ? "border-primary bg-primary text-white"
              : "border-border/80 bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-white"
          }`}
          aria-label="Filtres"
        >
          <SlidersHorizontal size={17} />
        </button>
      </form>

      {/* ── 2. Filtres par Capsules (Anime, Manga, Créateurs) ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setActiveTab("anime")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all ${
            activeTab === "anime"
              ? "bg-primary text-white shadow-md shadow-violet-500/25"
              : "border border-border/70 bg-card/60 text-muted-foreground hover:text-white"
          }`}
        >
          <Film size={13} />
          <span>Anime</span>
        </button>

        <button
          onClick={() => setActiveTab("manga")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all ${
            activeTab === "manga"
              ? "bg-primary text-white shadow-md shadow-violet-500/25"
              : "border border-border/70 bg-card/60 text-muted-foreground hover:text-white"
          }`}
        >
          <BookOpen size={13} />
          <span>Manga</span>
        </button>

        <button
          onClick={() => setActiveTab("creators")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-xs font-bold tracking-tight transition-all ${
            activeTab === "creators"
              ? "bg-primary text-white shadow-md shadow-violet-500/25"
              : "border border-border/70 bg-card/60 text-muted-foreground hover:text-white"
          }`}
        >
          <Users size={13} />
          <span>Créateurs</span>
        </button>
      </div>

      {/* ── 3. Résultats de recherche si recherche active ── */}
      {query.trim().length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-bold text-white tracking-wide">
              Résultats pour &ldquo;{query}&rdquo;
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              {results.length} trouvés
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
              <p className="text-xs text-muted-foreground">Recherche dans la base otaku…</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-card/40">
              <p className="text-sm font-medium text-white">Aucun résultat trouvé pour cette recherche</p>
              <p className="text-xs text-muted-foreground mt-1">Essaye avec un autre titre d&apos;anime ou de manga.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {results.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── 4. Mode Découverte (Tendances & Pour toi — Écran 2 Maquette) ── */
        <div className="space-y-6">
          {/* ── Section Tendances ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-[#EF4444]" />
                <h2 className="font-heading text-sm font-bold text-white tracking-tight">
                  Tendances
                </h2>
              </div>
              <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Voir tout &gt;
              </span>
            </div>

            {trendingLoading ? (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-[130px] shrink-0 h-[210px] rounded-2xl bg-card/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-1 px-1">
                {trending.slice(0, 10).map((anime) => (
                  <AnimeMiniCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            )}
          </section>

          {/* ── Section Pour toi ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#8B5CF6]" />
                <h2 className="font-heading text-sm font-bold text-white tracking-tight">
                  Pour toi
                </h2>
              </div>
              <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                Voir tout &gt;
              </span>
            </div>

            {trendingLoading ? (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-[130px] shrink-0 h-[210px] rounded-2xl bg-card/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-1 px-1">
                {topAnimes.slice(0, 10).map((anime) => (
                  <AnimeMiniCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/** Carte d'anime en carrousel horizontal (conforme Écran 2 de la maquette Nekama) */
function AnimeMiniCard({ anime }: { anime: JikanAnime }) {
  const imageUrl =
    anime.images.webp?.large_image_url ||
    anime.images.jpg?.large_image_url ||
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-[128px] shrink-0 flex flex-col group cursor-pointer"
    >
      <div className="relative w-full h-[175px] rounded-2xl overflow-hidden border border-border/80 bg-card/80 shadow-md">
        <Image
          src={imageUrl}
          alt={anime.title}
          fill
          sizes="128px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Dégradé bas pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27]/90 via-transparent to-transparent" />

        {/* Note en étoile en haut à droite */}
        {anime.score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-1.5 py-0.5 border border-white/10 text-[10px] font-bold text-white shadow">
            <Star size={10} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span>{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-0.5">
        <h3 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        <p className="text-[10px] text-muted-foreground">
          {anime.episodes ? `Épisode ${anime.episodes}` : "Épisodes en cours"}
        </p>
      </div>
    </motion.div>
  );
}

/** Carte d'anime pour la grille des résultats de recherche */
function AnimeCard({ anime }: { anime: JikanAnime }) {
  const imageUrl =
    anime.images.webp?.large_image_url ||
    anime.images.jpg?.large_image_url ||
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card/70 backdrop-blur-sm group p-2 shadow-md hover:border-primary/40 transition-all"
    >
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted/40">
        <Image
          src={imageUrl}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, 200px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {anime.score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white">
            <Star size={10} className="fill-[#FBBF24] text-[#FBBF24]" />
            <span>{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{anime.episodes ? `${anime.episodes} ép.` : "En cours"}</span>
          <span className="text-[9px] uppercase tracking-wider text-primary/90 font-semibold">
            {anime.type || "Anime"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
