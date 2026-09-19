// src/lib/constants.ts
import { Zap, Users, Calendar, BookOpen, Trophy, Flame } from "lucide-react";
import Image from "next/image";

// Import des types uniquement
import type { 
  NavItem, 
  Feature, 
  AboutData, 
  GalleryItem, 
  GalleryFilter, 
  FooterColumn, 
  SocialLink 
} from "./types";

// ── NAVIGATION ───────────────────────────────────────────────
export const NAVIGATION: NavItem[] = [
  { label: "Accueil",         href: "#home"     },
  { label: "Fonctionnalités", href: "#features" },
  { label: "À Propos",        href: "#about"    },
  { label: "Galerie",         href: "#gallery"  },
];

// ── MARQUEE — Titres d'animés ───────────────────────────────
export const ANIME_TITLES = [
  "Dragon Ball Z",
  "Naruto Shippuden",
  "One Piece",
  "Demon Slayer",
  "Jujutsu Kaisen",
  "Attack on Titan",
  "Hunter x Hunter",
  "Bleach",
  "My Hero Academia",
  "Death Note",
  "Fullmetal Alchemist",
  "Vinland Saga",
  "Chainsaw Man",
  "Spy × Family",
] as const;

// ── KANJI — Pluie de caractères ─────────────────────────────
export const KANJI = [
  "炎", "力", "夢", "魂", "剣", "闘", "星",
  "龍", "風", "雷", "海", "心", "鬼", "神",
  "火", "水", "影", "光", "侍", "勝",
] as const;

// ── FEATURES ────────────────────────────────────────────────
export const FEATURES: Feature[] = [
  {
    icon: Users,
    title: "Communauté",
    description: "Partage tes idées et échange avec d'autres passionnés d'animes et de mangas.",
    accent: "#FF3E00",
    tag: "Social",
    status: "active",
  },
  {
    icon: BookOpen,
    title: "Anime Tracker",
    description: "Suis tes anime, garde ta progression et ne rate pas les nouveaux épisodes.",
    accent: "#00F5FF",
    tag: "Tracker",
    status: "active",
  },
  {
    icon: Trophy,
    title: "Quiz",
    description: "Teste tes connaissances anime & manga à travers des quiz et des défis.",
    accent: "#F39C12",
    tag: "Quiz",
    status: "active",
  },
];

// ── ABOUT ───────────────────────────────────────────────────
export const ABOUT: AboutData = {
  tag: "Notre Vision",
  title: ["Un espace pensé", "par des passionnés", "pour des passionnés"],
  paragraphs: [
    "Nekama est né d'une conviction simple : les fans d'animés et de manga ivoiriens méritent leur propre espace d'échange. Un endroit moderne pour partager ses théories, suivre ses sorties hebdomadaires et tester ses connaissances sans complexe.",
    "De Yopougon à Cocody, de Bouaké à San-Pédro — nous connectons une génération entière unie par la même passion. Ton univers manga, à portée de main.",
  ],
  highlights: [],
  pillars: [
    { emoji: "🎌", label: "Culture Locale", text: "Une communauté 100% connectée aux réalités de la Côte d'Ivoire." },
    { emoji: "⚡", label: "Instant Vivant", text: "Partage tes coups de cœur, tes théories et discute avec tes Nakamas." },
    { emoji: "🏆", label: "Défis Hebdomadaires", text: "Grimpe les échelons en testant tes connaissances manga." },
  ],
};

// ── GALLERY ─────────────────────────────────────────────────
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, label: "Cosplay Naruto ABI'CON 2024", category: "cosplay", span: "tall", gradient: "linear-gradient(135deg,#7f2000,#1a0000)", emoji: "🍥", imageUrl: "@/../..public/img3.png" },
  { id: 2, label: "Fan Art – Goku Ivoirien", category: "fanart", span: "normal", gradient: "linear-gradient(135deg,#7a4800,#1a0e00)", emoji: "⚡", imageUrl: "@/../..public/image1.png" },
  { id: 3, label: "Event Cosplay Cocody", category: "event", span: "normal", gradient: "linear-gradient(135deg,#003d5c,#001a28)", emoji: "🎌", imageUrl: "@/../..public/event1.jpg" },
  { id: 4, label: "Fan Art – Akatsuki 225", category: "artwork", span: "wide", gradient: "linear-gradient(135deg,#3d0000,#0a0000)", emoji: "🌙", imageUrl: "@/../..public/artwork1.jpg" },
  { id: 5, label: "Tournoi Dragon Ball Z", category: "event", span: "normal", gradient: "linear-gradient(135deg,#001f5c,#000b28)", emoji: "🏆", imageUrl: "@/../..public/event2.jpg" },
  { id: 6, label: "Cosplay Demon Slayer", category: "cosplay", span: "normal", gradient: "linear-gradient(135deg,#3d005c,#0a0028)", emoji: "⚔️", imageUrl: "@/../..public/cosplay2.jpg" },
];

export const GALLERY_FILTERS: GalleryFilter[] = [
  { label: "Tout", value: "all" },
  { label: "Cosplay", value: "cosplay" },
  { label: "Fan Art", value: "fanart" },
  { label: "Événements", value: "event" },
  { label: "Artwork", value: "artwork" },
];

// ── FOOTER ──────────────────────────────────────────────────
export const FOOTER_COLS: FooterColumn[] = [
  {
    title: "Plateforme",
    links: [
      { label: "Fonctionnalités", href: "#features" },
      { label: "Événements", href: "#" },
      { label: "Classements", href: "#" },
      { label: "Fan Art", href: "#gallery" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Discord", href: "#" },
      { label: "Forums", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "Partenaires", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { emoji: "🎵", label: "TikTok", href: "#", members: "15K" },
  { emoji: "📸", label: "Instagram", href: "#", members: "8.7K" },
  { emoji: "💬", label: "Discord", href: "#", members: "4.2K" },
  { emoji: "📱", label: "WhatsApp", href: "#", members: "2.1K" },
  { emoji: "▶", label: "YouTube", href: "#", members: "3.5K" },
];

// ── DESIGN TOKENS ───────────────────────────────────────────
export const COLORS = {
  primary: "#FF6B1A",
  danger: "#C0392B",
  accent: "#00D4FF",
  bg: "#050508",
  surface: "#0d0d14",
} as const;