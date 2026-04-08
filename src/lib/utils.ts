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

export async function isUsernameAvailable(username: string) {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase())
  );

  const snapshot = await getDocs(q);

  return snapshot.empty; // true = disponible
}