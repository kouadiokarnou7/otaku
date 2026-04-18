import type { JikanAnime } from "@/lib/api/jikan";
import { getBestImageUrl } from "@/lib/api/jikan";

interface SearchResultCardProps {
  anime: JikanAnime;
}

export default function SearchResultCard({ anime }: SearchResultCardProps) {
  return (
    <article className="group grid gap-4 rounded-3xl border border-white/10 bg-[#0b1131]/80 p-4 transition hover:-translate-y-0.5 hover:border-orange-400/30 hover:bg-[#111a3f]/90">
      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
        <img
          src={getBestImageUrl(anime)}
          alt={anime.title}
          className="h-40 w-full min-w-[140px] rounded-3xl object-cover shadow-lg shadow-black/30"
        />
        <div className="space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-orange-400">{anime.type}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{anime.title}</h3>
          </div>
          <div className="grid gap-2 text-sm text-gray-300">
            <p className="line-clamp-3">{anime.synopsis || "Aucune description disponible."}</p>
            <div className="flex flex-wrap gap-2">
              {anime.genres?.slice(0, 4).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <span>{anime.status}</span>
        <span>{anime.episodes ?? "?"} épisodes</span>
        <span>Score {anime.score ?? "N/A"}</span>
        <span>Popularité #{anime.popularity}</span>
      </div>
    </article>
  );
}
