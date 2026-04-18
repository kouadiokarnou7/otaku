"use client";

import { useEffect, useState, useCallback } from "react";
import {
  searchAnime,
  getTopAnimes,
  getCurrentSeasonAnimes,
  type JikanAnime,
} from "@/lib/api/jikan";

const SUGGESTED_SEARCHES = [
  "action",
  "romance",
  "isekai",
  "fantasy",
  "shonen",
  "aesthetic",
  "slice of life",
  "mecha",
  "thriller",
  "mystery",
];

export function useAnimeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [trending, setTrending] = useState<JikanAnime[]>([]);
  const [topAnimes, setTopAnimes] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    setTrendingLoading(true);
    setError(null);

    try {
      const [seasonResponse, topResponse] = await Promise.all([
        getCurrentSeasonAnimes(),
        getTopAnimes("bypopularity", 1, 10),
      ]);

      setTrending(seasonResponse.data ?? []);
      setTopAnimes(topResponse.data ?? []);
    } catch (err) {
      setError("Impossible de charger les tendances. Vérifie ta connexion ou réessaye plus tard.");
      console.error("❌ useAnimeSearch fetchTrending:", err);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const search = useCallback(
    async (searchTerm: string) => {
      const normalized = searchTerm.trim();
      if (!normalized) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchAnime(normalized, 1, 15);
        setResults(response.data ?? []);
      } catch (err) {
        setError("Erreur lors de la recherche. Essaie une autre requête.");
        console.error("❌ useAnimeSearch search:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    query,
    setQuery,
    results,
    trending,
    topAnimes,
    loading,
    trendingLoading,
    error,
    search,
    fetchTrending,
    suggestedSearches: SUGGESTED_SEARCHES,
  };
}
