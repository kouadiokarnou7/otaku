import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateAvatar(username: string) {
  if (!username) return null;

  return username.slice(0, 2).toUpperCase();
}

// lib/firebase/checkUsername.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";

export function generateUniqueUsername(base: string): string {
  const clean = base
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 12);
  
  // Suffixe aléatoire sur 4 caractères = 1,6M de combinaisons
  const suffix = Math.random().toString(36).slice(2, 6);
  
  return `${clean}_${suffix}`;
}
