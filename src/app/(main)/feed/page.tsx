"use client";

import { useState } from "react";
// ✅ Correct — sépare les types
import {  FeedFilter, PostList } from "@/components/features/feed/Index";
import type { FeedFilter as FeedFilterType } from "@/components/features/feed/Types";
import { MOCK_POSTS } from "@/components/features/feed/Mockdata";

export default function FeedPage() {
  const [filter, setFilter] = useState<FeedFilterType>("all");

  // Quand l'onglet "Abonnements" est actif → liste vide pour simuler
  const posts = filter === "following" ? [] : MOCK_POSTS;

  return (
    <div>
      {/* Bannière création rapide */}
     

      {/* Filtre Tous / Abonnements */}
      <FeedFilter active={filter} onChange={setFilter} />

      {/* Liste des posts */}
      <PostList posts={posts} filter={filter} />
    </div>
  );
}