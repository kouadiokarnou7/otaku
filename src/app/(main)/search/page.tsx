"use client";

import { useCallback, useState, useEffect } from "react";
import SearchForm from "@/components/features/search/SearchForm";
import SearchResultCard from "@/components/features/search/SearchResultCard";
import { useAnimeSearch } from "@/lib/hooks/search/useAnimeSearch";
import { Clock, RotateCcw } from "lucide-react";

export default function SearchPage() {
  const {
    query,
    setQuery,
    results,
    trending,
    topAnimes,
    loading,
    trendingLoading,
    error,
    search,
    suggestedSearches,
  } = useAnimeSearch();

  // Pagination et historique
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const itemsPerPage = 6;

  // Charger l'historique depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder l'historique
  const saveToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const updated = [term, ...prev.filter((h) => h !== term)].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCurrentPage(1);
      setShowHistory(false);
      saveToHistory(query);
      await search(query);
    },
    [query, search, saveToHistory]
  );

  const handleQuickSearch = async (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    setShowHistory(false);
    saveToHistory(value);
    await search(value);
  };

  const handleHistorySearch = async (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    setShowHistory(false);
    await search(value);
  };

  // Pagination
  const totalPages = Math.min(
    Math.ceil(results.length / itemsPerPage),
    99
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = window.innerWidth < 640 ? 5 : 9;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Première page
    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-2.5 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all text-xs sm:text-sm font-medium"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="dots1" className="px-1 text-gray-500 text-xs sm:text-sm">
            ...
          </span>
        );
      }
    }

    // Pages numérotées
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-2.5 py-1.5 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
            currentPage === i
              ? "border-orange-500 bg-orange-500/40 text-white shadow-lg shadow-orange-500/30"
              : "border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20"
          }`}
        >
          {i}
        </button>
      );
    }

    // Dernière page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-1 text-gray-500 text-xs sm:text-sm">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-2.5 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all text-xs sm:text-sm font-medium"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {pages}
        </div>
        <div className="text-center text-xs sm:text-sm text-gray-400">
          Page{" "}
          <span className="text-orange-400 font-bold">{currentPage}</span> sur{" "}
          <span className="text-orange-400 font-bold">
            {totalPages > 99 ? "99+" : totalPages}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1430] to-[#050820] text-white">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-12 lg:px-8">
        <section className="grid gap-6 sm:gap-8">
          {/* Search Box with Controls */}
          <div className="rounded-2xl sm:rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-5 sm:p-8 shadow-2xl shadow-orange-500/10 backdrop-blur-xl">
            <SearchForm
              query={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              loading={loading}
            />

            {/* Control Buttons */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔍 Rechercher
              </button>

              <button
                onClick={() => void search(query)}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw size={16} /> Actualiser
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-500/30 bg-gray-500/10 text-gray-300 hover:border-gray-500/50 hover:bg-gray-500/20 transition-all text-xs sm:text-sm font-medium"
                >
                  <Clock size={16} /> Historique
                  {searchHistory.length > 0 && (
                    <span className="ml-1 text-orange-400 font-bold">
                      {searchHistory.length}
                    </span>
                  )}
                </button>

                {/* History Dropdown */}
                {showHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 w-56 bg-[#0a0e27] border border-orange-500/30 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => void handleHistorySearch(item)}
                        className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-300 hover:bg-orange-500/20 hover:text-orange-300 transition-all border-b border-orange-500/10 last:border-b-0"
                      >
                        🕐 {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-orange-500/10">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-gray-400 font-semibold mb-3">
                Recherches rapides
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((label) => (
                  <button
                    key={label}
                    onClick={() => void handleQuickSearch(label)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-300 text-[10px] sm:text-xs font-medium hover:border-orange-500/50 hover:bg-orange-500/15 transition-all"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5 text-xs sm:text-sm text-red-200 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Results with Pagination */}
          {results.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-1">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    Résultats « <span className="text-orange-400">{query}</span> »
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {results.length > 99 ? "99+" : results.length} animé(s) 🎬
                  </p>
                </div>
                <button
                  onClick={() => void search(query)}
                  className="self-start sm:self-auto px-3 sm:px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all text-xs sm:text-sm font-medium"
                >
                  ↻
                </button>
              </div>

              <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                {currentResults.map((anime) => (
                  <SearchResultCard key={anime.mal_id} anime={anime} />
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8">
              {/* Trending Section */}
              <section className="rounded-2xl sm:rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-5 sm:p-8 shadow-xl shadow-orange-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-white">
                      🔥 Tendances
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      Nouveautés et classiques
                    </p>
                  </div>
                  <button
                    onClick={() => void search("action")}
                    className="self-start sm:self-auto px-3 sm:px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all whitespace-nowrap text-xs sm:text-sm font-medium"
                  >
                    Action
                  </button>
                </div>

                {trendingLoading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-block animate-spin text-2xl">⌛</div>
                    <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                      Chargement...
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
                    {trending.slice(0, 4).map((anime) => (
                      <SearchResultCard key={anime.mal_id} anime={anime} />
                    ))}
                  </div>
                )}
              </section>

              {/* Top Animes Section */}
              <section className="rounded-2xl sm:rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-5 sm:p-8 shadow-xl shadow-purple-500/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-white">
                      👑 Cultes
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      Classiques populaires
                    </p>
                  </div>
                  <button
                    onClick={() => void handleQuickSearch("fantasy")}
                    className="self-start sm:self-auto px-3 sm:px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all whitespace-nowrap text-xs sm:text-sm font-medium"
                  >
                    Fantasy
                  </button>
                </div>

                <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
                  {topAnimes.slice(0, 4).map((anime) => (
                    <SearchResultCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
