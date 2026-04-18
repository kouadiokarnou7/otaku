import type { JikanAnime } from "@/lib/api/jikan";
import { getBestImageUrl } from "@/lib/api/jikan";
import Image from "next/image";

interface SearchResultCardProps {
  anime: JikanAnime;
}

export default function SearchResultCard({ anime }: SearchResultCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl sm:rounded-3xl border border-orange-500/20 bg-gradient-to-br from-[#0a0e27] via-[#0b1131] to-[#151e3f] overflow-hidden transition hover:border-orange-500/50 hover:bg-[#111a3f]/90 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/20">
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-black/40">
        <Image
          src={getBestImageUrl(anime)}
          alt={anime.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {/* Score Badge */}
        <div className="absolute top-2 right-2 bg-gradient-to-br from-orange-500 to-orange-600 px-2 py-1 rounded-lg text-white text-xs font-bold shadow-lg">
          ⭐ {anime.score ?? "N/A"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3 p-3 sm:p-4">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-orange-400 font-bold">{anime.type}</p>
          <h3 className="mt-1.5 text-sm sm:text-base font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
            {anime.title}
          </h3>
        </div>

        {/* Synopsis */}
        <p className="text-xs text-gray-400 line-clamp-2 flex-1">{anime.synopsis || "Aucune description"}</p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {anime.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre.mal_id}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/20 transition-all cursor-pointer"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-gray-400">
          <span className="px-2 py-0.5 bg-orange-500/5 border border-orange-500/10 rounded text-orange-300 font-medium">
            {anime.status}
          </span>
          <span className="px-2 py-0.5 bg-purple-500/5 border border-purple-500/10 rounded text-purple-300 font-medium">
            {anime.episodes ?? "?"} eps
          </span>
          <span className="px-2 py-0.5 bg-pink-500/5 border border-pink-500/10 rounded text-pink-300 font-medium">
            #{anime.popularity}
          </span>
        </div>
      </div>
    </article>
  );
}
