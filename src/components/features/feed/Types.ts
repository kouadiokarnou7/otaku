// ── User ────────────────────────────────────────────────────
export interface FeedUser {
  id:       string;
  username: string;
  avatar:   string;   // URL ou initiales fallback
  rank:     "Genin" | "Chunin" | "Jonin" | "Hokage";
  xp:       number;
}

// ── Anime attaché à un post ──────────────────────────────────
export interface PostAnime {
  id:    number;
  title: string;
  cover: string;   // URL cover Jikan
}

// ── Type de post ─────────────────────────────────────────────
export type PostType =
  | "start"      // vient de commencer un anime
  | "finish"     // vient de terminer un anime
  | "review"     // avis général
  | "hottake"    // opinion controversée
  | "question";  // pose une question à la communauté

// ── Post ────────────────────────────────────────────────────
export interface Post {
  id:        string;
  user:      FeedUser;
  type:      PostType;
  content:   string;
  anime?:    PostAnime;
  createdAt: string;       // format relatif : "2h", "1j"
  likes:     number;
  comments:  number;
  liked:     boolean;      // true si l'utilisateur courant a liké
  saved:     boolean;
}

// ── Filtre feed ──────────────────────────────────────────────
export type FeedFilter = "all" | "following";