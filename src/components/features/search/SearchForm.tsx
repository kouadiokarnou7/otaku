"use client";

import { FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFormProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

export default function SearchForm({ query, onChange, onSubmit, loading }: SearchFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" size={20} />
        <Input
          label="Rechercher un animé"
          placeholder="Titre, genre ou mot-clé..."
          value={query}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          className="pl-12 py-3 bg-[#0a0e27] border-orange-500/20 text-white placeholder:text-gray-500 rounded-xl focus:border-orange-500/50 focus:ring-orange-500/20"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⌛</span>
            Recherche en cours...
          </>
        ) : (
          <>
            <Search size={18} />
            Trouver des animés
          </>
        )}
      </button>
    </form>
  );
}
