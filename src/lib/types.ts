
import type { UseFormRegisterReturn } from "react-hook-form";
import { Timestamp } from "firebase/firestore";
import { Date } from "@hugeicons/core-free-icons";

// src/lib/types.ts
import { LucideIcon } from "lucide-react";

// ── NAVIGATION ───────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

// ── FEATURES ────────────────────────────────────────────────
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  tag: string;
}

// ── ABOUT ───────────────────────────────────────────────────
export interface Highlight {
  label: string;
  value: string;
}

export interface Pillar {
  emoji: string;
  label: string;
  text: string;
}

export interface AboutData {
  tag: string;
  title: string[];
  paragraphs: string[];
  highlights: Highlight[];
  pillars: Pillar[];
}

// ── GALLERY ─────────────────────────────────────────────────
export type GalleryCategory = "cosplay" | "fanart" | "event" | "artwork";

export interface GalleryItem {
  id: number;
  label: string;
  category: GalleryCategory;
  imageUrl: string;
  span: "tall" | "wide" | "normal";
  gradient: string;
  emoji: string;
}

export interface GalleryFilter {
  label: string;
  value: "all" | GalleryCategory;
}

// ── FOOTER ──────────────────────────────────────────────────
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  emoji: string;
  label: string;
  href: string;
  members: string;
}


export interface InputFieldProps {
  label:        string;
  type:         "text" | "email" | "password";
  placeholder:  string;
  registration: UseFormRegisterReturn;
  error?:       string;
  autoComplete?: string;
  avatar?:       string;
}



export interface ProfileStats {
  animesCount: number;
  postsCount: number;
  followersCount?: number;   // Optionnel : absent des anciens documents Firestore
  followingCount?: number;   // Optionnel : absent des anciens documents Firestore
  gamesCount: number;        // ✅ Nouveau : suivi des jeux
  xp: number;                // ✅ Points d'expérience pour la progression
  level: number;             // ✅ Niveau calculé depuis l'XP
  rank: number;              // Rang global (classement)
  badge: {                   // ✅ Badge structuré pour plus de flexibilité
    id: string;
    name: string;
    icon: string;            // emoji ou URL icône
    color: string;           // ex: "violet", "gold"
  } | null;
}

// ── RÔLES ────────────────────────────────────────────────────
// ⚠️ Le rôle n'est PAS modifiable par l'utilisateur : les Firestore
// Security Rules interdisent toute écriture sur ce champ (voir
// FIRESTORE_RULES.md). La promotion en admin se fait uniquement
// depuis la console Firebase.
export type UserRole = "user" | "admin";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  phone: string;
  role: UserRole;
  createdAt: Date | null;
  updatedAt?: Date | null;
  stats: ProfileStats;
}

// ✅ Helpers pour la progression
export const calculateLevel = (xp: number): number => 
  Math.floor(1 + Math.sqrt(xp / 100)); // Formule exemple, à ajuster

export const getNextLevelXp = (level: number): number => 
  Math.pow(level, 2) * 100;
 
export interface ProfileFormData {
  displayName: string;
  bio: string;
  phone: string;
}

// ── AUTH TYPES ───────────────────────────────────────────────
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export interface LoginFormData {
  identifier: string; // email ou username
  password: string;
  rememberMe?: boolean;
}

export interface FirebaseAuthError extends Error {
  code?: string;
  message: string;
}
 
export interface FeedbackMessage {
  type: "success" | "error" | "";
  text: string;
}
 

//les post et autres types liés au feed

export interface PostMedia {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Post {
  id: string;
  uid: string;
  username: string;
  photoURL: string | null;
  userLevel?: number;        // Pour affichage gamifié
  userBadge?: string;        // Badge icon rapide
  
  content: string;
  media?: PostMedia;
  
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  
  likedByUser?: boolean;     // Optimistic UI
  
  metadata: {
    createdAt: Date;
    updatedAt?: Date;
    tags?: string[];
    visibility: 'public' | 'followers' | 'private';
  };
}

export interface Comment {
  id: string;
  postId: string;
  uid: string;
  username: string;
  userAvatar: string | null;
  content: string;
  createdAt: Timestamp;
  likes: number;
}

export interface ComposerState {
  content: string;
  mediaFile: File | null;
  mediaPreview: string | null;
  isUploading: boolean;
  visibility: 'public' | 'followers';
}