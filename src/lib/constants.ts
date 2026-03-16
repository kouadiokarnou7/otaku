// src/lib/constants.ts
import { Zap, Users, Calendar, BookOpen, Trophy, Flame } from "lucide-react";

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
    icon: Zap,
    title: "Actualités 225",
    description: "Toutes les sorties d'animés filtrées pour la communauté ivoirienne. Sois le premier informé avant tout le monde.",
    accent: "#FF6B1A",
    tag: "Live",
  },
  {
    icon: Users,
    title: "Forums & Débats",
    description: "Théories folles, spoilers chauds, débats interminables. Ton espace pour t'exprimer sans filtre entre passionnés.",
    accent: "#C0392B",
    tag: "Social",
  },
  {
    icon: Calendar,
    title: "Événements 225",
    description: "Conventions, cosplay, tournois à Abidjan et dans toute la CI. Plus jamais d'event raté.",
    accent: "#00D4FF",
    tag: "IRL",
  },
  {
    icon: BookOpen,
    title: "Bibliothèque Manga",
    description: "Catalogue complet avec notes, reviews et recommandations curées par la communauté locale.",
    accent: "#9B59B6",
    tag: "Culture",
  },
  {
    icon: Trophy,
    title: "Classements & Quêtes",
    description: "Gagne des badges, monte en rang, deviens le Hokage de la communauté 225. La gamification au service de la passion.",
    accent: "#F39C12",
    tag: "Gamification",
  },
  {
    icon: Flame,
    title: "Fan Art & Cosplay",
    description: "Expose tes créations, vote pour les meilleures œuvres, fais découvrir les talents ivoiriens au monde entier.",
    accent: "#E74C3C",
    tag: "Créatif",
  },
];

// ── ABOUT ───────────────────────────────────────────────────
export const ABOUT: AboutData = {
  tag: "Notre Mission",
  title: ["Bâtir le pont entre", "la culture Otaku", "et la Côte d'Ivoire"],
  paragraphs: [
    "Otaku 225 est né d'une conviction simple : les fans d'animés et de manga ivoiriens méritent leur propre espace. Un endroit qui parle leur langue, connaît leur réalité et célèbre leur passion sans complexe.",
    "De Yopougon à Cocody, de Bouaké à San-Pédro — nous connectons une génération entière qui a grandi avec Dragon Ball, Naruto et One Piece. Ton \"225\" dans notre nom, c'est toi.",
  ],
  highlights: [
    { label: "Fondé en", value: "2026" },
    { label: "Ville", value: "Abidjan" },
    { label: "Membres", value: "10K+" },
  ],
  pillars: [
    { emoji: "📍", label: "Ancré en Côte d'Ivoire", text: "Contenu localisé, événements locaux, communauté 100% ivoirienne." },
    { emoji: "❤", label: "Passion sans frontières", text: "Anime, manga, cosplay, fan art — toutes les expressions bienvenues." },
    { emoji: "🌍", label: "Connecté au monde", text: "Les dernières actus mondiales filtrées pour la communauté 225." },
  ],
};

// ── GALLERY ─────────────────────────────────────────────────
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, label: "Cosplay Naruto ABI'CON 2024", category: "cosplay", span: "tall", gradient: "linear-gradient(135deg,#7f2000,#1a0000)", emoji: "🍥" },
  { id: 2, label: "Fan Art – Goku Ivoirien", category: "fanart", span: "normal", gradient: "linear-gradient(135deg,#7a4800,#1a0e00)", emoji: "⚡" },
  { id: 3, label: "Event Cosplay Cocody", category: "event", span: "normal", gradient: "linear-gradient(135deg,#003d5c,#001a28)", emoji: "🎌" },
  { id: 4, label: "Fan Art – Akatsuki 225", category: "artwork", span: "wide", gradient: "linear-gradient(135deg,#3d0000,#0a0000)", emoji: "🌙" },
  { id: 5, label: "Tournoi Dragon Ball Z", category: "event", span: "normal", gradient: "linear-gradient(135deg,#001f5c,#000b28)", emoji: "🏆" },
  { id: 6, label: "Cosplay Demon Slayer", category: "cosplay", span: "normal", gradient: "linear-gradient(135deg,#3d005c,#0a0028)", emoji: "⚔️" },
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