"use client";

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";

interface SearchFormProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
}

export default function SearchForm({ query, onChange, onSubmit, loading }: SearchFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <Input
        label="Rechercher un animé"
        placeholder="Titre, genre ou mot-clé..."
        value={query}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      <Button type="submit" variant="primary" fullWidth isLoading={loading}>
        Trouver des animés
      </Button>
    </form>
  );
}
