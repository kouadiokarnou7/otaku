
import type { UseFormRegisterReturn } from "react-hook-form";


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