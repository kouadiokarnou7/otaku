import type { JikanAnime } from "@/lib/api/jikan";
import { getBestImageUrl } from "@/lib/api/jikan";
import Image from "next/image";

interface SearchResultCardProps {
  anime: JikanAnime;
}

export default function SearchResultCard({ anime }: SearchResultCardProps) {
  return (
    <article className="group grid gap-4 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0a0e27] via-[#0b1131] to-[#151e3f] p-4 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-[#111a3f]/90 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/20">
      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
        <div className="relative h-40 w-full min-w-[140px] rounded-3xl overflow-hidden shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/30 transition-shadow">
          <Image
            src={getBestImageUrl(anime)}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            width={140}
            height={160}
            priority
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-orange-400 font-bold">{anime.type}</p>
            <h3 className="mt-2 text-xl font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2">{anime.title}</h3>
          </div>
          <div className="grid gap-2 text-sm text-gray-300">
            <p className="line-clamp-2 text-gray-400">{anime.synopsis || "Aucune description disponible."}</p>
            <div className="flex flex-wrap gap-2">
              {anime.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all cursor-pointer"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        <span className="px-2 py-1 bg-orange-500/5 border border-orange-500/10 rounded text-orange-300">{anime.status}</span>
        <span className="px-2 py-1 bg-purple-500/5 border border-purple-500/10 rounded text-purple-300">{anime.episodes ?? "?"} eps</span>
        <span className="px-2 py-1 bg-blue-500/5 border border-blue-500/10 rounded text-blue-300">⭐ {anime.score ?? "N/A"}</span>
        <span className="px-2 py-1 bg-pink-500/5 border border-pink-500/10 rounded text-pink-300">#{anime.popularity}</span>
      </div>
    </article>
  );
}
