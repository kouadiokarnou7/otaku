import type { Post } from "./Types";

export const MOCK_POSTS: Post[] = [
  {
    id:        "1",
    user: {
      id:       "u1",
      username: "alice_otaku",
      avatar:   "AO",
      rank:     "Jonin",
      xp:       4200,
    },
    type:      "finish",
    content:   "Viens de terminer Jujutsu Kaisen season 2 😭🔥 Le arc de Shibuya c'est une claque monumentale. Gojo > tout. Débattez.",
    anime: {
      id:    41587,
      title: "Jujutsu Kaisen Season 2",
      cover: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
    },
    createdAt: "2h",
    likes:     234,
    comments:  18,
    liked:     false,
    saved:     false,
  },
  {
    id:        "2",
    user: {
      id:       "u2",
      username: "shonen_kofi",
      avatar:   "SK",
      rank:     "Chunin",
      xp:       1850,
    },
    type:      "start",
    content:   "Je commence Vinland Saga aujourd'hui, tout le monde en parle. J'espère que ça va être à la hauteur 🙏",
    anime: {
      id:    37521,
      title: "Vinland Saga",
      cover: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg",
    },
    createdAt: "4h",
    likes:     47,
    comments:  12,
    liked:     true,
    saved:     false,
  },
  {
    id:        "3",
    user: {
      id:       "u3",
      username: "abidjan_weeb",
      avatar:   "AW",
      rank:     "Hokage",
      xp:       9800,
    },
    type:      "hottake",
    content:   "Hot take : Naruto Shippuden sans les fillers c'est un anime 10/10. Les fillers l'ont juste rendu imbuvable pour beaucoup. Vous pensez quoi ? 👀",
    createdAt: "6h",
    likes:     512,
    comments:  94,
    liked:     false,
    saved:     true,
  },
  {
    id:        "4",
    user: {
      id:       "u4",
      username: "yopougon_fan",
      avatar:   "YF",
      rank:     "Genin",
      xp:       320,
    },
    type:      "question",
    content:   "Quelqu'un peut me recommander un anime similaire à Attack on Titan ? J'ai tout regardé et je suis en manque 😭",
    createdAt: "8h",
    likes:     29,
    comments:  33,
    liked:     false,
    saved:     false,
  },
  {
    id:        "5",
    user: {
      id:       "u5",
      username: "cocody_sensei",
      avatar:   "CS",
      rank:     "Jonin",
      xp:       5100,
    },
    type:      "review",
    content:   "Chainsaw Man arc 1 terminé. Le character design, la BO, la violence... Fujimoto est un génie malade. 9/10 sans hésiter 🪚❤️‍🔥",
    anime: {
      id:    44511,
      title: "Chainsaw Man",
      cover: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    },
    createdAt: "1j",
    likes:     183,
    comments:  27,
    liked:     true,
    saved:     false,
  },
];

// ── Labels par type de post ──────────────────────────────────
export const POST_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  start:    { label: "Commence",    color: "#00D4FF" },
  finish:   { label: "A terminé",   color: "#2ecc71" },
  review:   { label: "Review",      color: "#9B59B6" },
  hottake:  { label: "Hot Take 🔥", color: "#FF6B1A" },
  question: { label: "Question",    color: "#F39C12" },
};

// ── Labels de rang ───────────────────────────────────────────
export const RANK_COLORS: Record<string, string> = {
  Genin:  "rgba(107,114,128,0.8)",
  Chunin: "rgba(0,212,255,0.8)",
  Jonin:  "rgba(155,89,182,0.8)",
  Hokage: "rgba(255,107,26,0.9)",
};