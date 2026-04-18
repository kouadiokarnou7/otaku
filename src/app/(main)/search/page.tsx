"use client";

import { useCallback } from "react";
import SearchForm from "@/components/features/search/SearchForm";
import SearchResultCard from "@/components/features/search/SearchResultCard";
import { useAnimeSearch } from "@/lib/hooks/search/useAnimeSearch";

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

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await search(query);
    },
    [query, search]
  );

  const handleQuickSearch = async (value: string) => {
    setQuery(value);
    await search(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1430] to-[#050820] text-white">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mx-auto max-w-4xl space-y-6 pb-8 text-center">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.45em] text-orange-400 font-bold">🔍 Recherche Avancée</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-orange-300 to-orange-500 bg-clip-text text-transparent">
              Découvre ton prochain animé culte
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-300">
            Explore les tendances, découvre des animés populaires et laisse-nous te guider vers ton prochain maraton selon tes goûts.
          </p>
        </header>

        <section className="grid gap-8">
          {/* Search Box */}
          <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-8 shadow-2xl shadow-orange-500/10 backdrop-blur-xl">
            <SearchForm query={query} onChange={setQuery} onSubmit={handleSubmit} loading={loading} />

            {/* Quick Suggestions */}
            <div className="mt-6 pt-6 border-t border-orange-500/10">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-400 font-semibold mb-4">Recherches rapides</p>
              <div className="flex flex-wrap gap-2">
                {suggestedSearches.map((label) => (
                  <button
                    key={label}
                    onClick={() => void handleQuickSearch(label)}
                    className="px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-300 text-sm font-medium hover:border-orange-500/50 hover:bg-orange-500/15 transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 px-2">
                <div>
                  <h2 className="text-2xl font-bold text-white">Résultats pour « <span className="text-orange-400">{query}</span> »</h2>
                  <p className="text-sm text-gray-400 mt-1">{results.length} animé(s) trouvé(s) 🎬</p>
                </div>
                <button 
                  onClick={() => void search(query)}
                  className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all"
                >
                  ↻
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {results.map((anime) => (
                  <SearchResultCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {/* Trending Section */}
              <section className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-8 shadow-xl shadow-orange-500/10">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      🔥 Tendances du moment
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Les nouveautés et classiques qui font le buzz</p>
                  </div>
                  <button 
                    onClick={() => void search("action")}
                    className="px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all whitespace-nowrap"
                  >
                    Voir action
                  </button>
                </div>

                {trendingLoading ? (
                  <div className="mt-8 text-center py-12">
                    <div className="inline-block animate-spin">⌛</div>
                    <p className="text-gray-400 mt-4">Chargement des tendances...</p>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {trending.slice(0, 4).map((anime) => (
                      <SearchResultCard key={anime.mal_id} anime={anime} />
                    ))}
                  </div>
                )}
              </section>

              {/* Top Animes Section */}
              <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#0f1430]/80 via-[#1a1f3a]/80 to-[#0a0e27]/80 p-8 shadow-xl shadow-purple-500/10">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      👑 Animes cultes
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Les classiques et pépites les plus regardés</p>
                  </div>
                  <button 
                    onClick={() => void handleQuickSearch("fantasy")}
                    className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all whitespace-nowrap"
                  >
                    Voir fantasy
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
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
