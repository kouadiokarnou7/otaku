"use client";

import { useCallback } from "react";
import SearchForm from "@/components/features/search/SearchForm";
import SearchResultCard from "@/components/features/search/SearchResultCard";
import { useAnimeSearch } from "@/lib/hooks/search/useAnimeSearch";
import Button from "@/components/ui/button";

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
    <div className="min-h-screen bg-[#060b1f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl space-y-4 pb-6 text-center">
          <p className="text-sm uppercase tracking-[0.45em] text-orange-400">Recherche</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Trouve un animé culte selon tes goûts</h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-300 sm:text-base">
            Explore les tendances, découvre des animés populaires et laisse-nous te guider vers ton prochain maraton.
          </p>
        </header>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <SearchForm query={query} onChange={setQuery} onSubmit={handleSubmit} loading={loading} />

            <div className="mt-5">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Suggestions rapides</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {suggestedSearches.map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => void handleQuickSearch(label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Résultats pour « {query} »</h2>
                  <p className="text-sm text-gray-400">{results.length} animé(s) trouvé(s)</p>
                </div>
                <Button type="button" variant="ghost" onClick={() => void search(query)}>
                  Actualiser
                </Button>
              </div>
              <div className="grid gap-4">
                {results.map((anime) => (
                  <SearchResultCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Tendances du moment</h2>
                    <p className="text-sm text-gray-400">Les nouveautés et classiques du moment.</p>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => void search("action")}>Voir action</Button>
                </div>

                {trendingLoading ? (
                  <div className="mt-6 text-gray-400">Chargement des tendances...</div>
                ) : (
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {trending.slice(0, 4).map((anime) => (
                      <SearchResultCard key={anime.mal_id} anime={anime} />
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Animes cultes</h2>
                    <p className="text-sm text-gray-400">Les titres les plus populaires et recommandés.</p>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => void handleQuickSearch("fantasy")}>Voir fantasy</Button>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
