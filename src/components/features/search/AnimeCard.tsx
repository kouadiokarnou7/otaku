"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import "next/image";

interface AnimeCardProps {
  id: number;
  title: string;
  image: string;
  score: number;
  type: string;
  onAddToList?: () => void;
}

export default function AnimeCard({
  id,
  title,
  image,
  score,
  type,
  onAddToList,
}: AnimeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-slate-900">
        <image
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2 flex items-center gap-1 backdrop-blur">
          <Star size={14} className="text-yellow-300 fill-yellow-300" />
          <span className="text-xs font-bold text-white">{score.toFixed(1)}</span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-purple-500/80 backdrop-blur rounded-full text-xs font-medium text-white">
          {type}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 relative z-10">
        <h3 className="font-bold text-sm text-white line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors">
          {title}
        </h3>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAddToList}
            className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium text-white transition flex items-center gap-2 justify-center"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
          <Link
            href={`/search/${id}`}
            className="flex-1 py-2 px-3 border border-white/20 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition text-center"
          >
            Détails
          </Link>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-500 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
