/**
 * Script de rétrogradation d'un utilisateur au rôle 'user' simple
 * Usage : node scripts/reset-to-user.mjs [UID]
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("👤 Rétrogradation au rôle simple 'user'...\n");

const env = {};
try {
  const envContent = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
  envContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join("=").trim();
    }
  });
} catch (e) {
  // ignore
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA5NF_gQ453NJE6DilAPcEeYPLgxxbRRwk",
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "otaku-tesy.firebaseapp.com",
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otaku-tesy",
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "otaku-tesy.firebasestorage.app",
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "363540337270",
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:363540337270:web:5fb280cc53fe18fe0a0557"
};

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const targetUid = process.argv[2] || "bTPkElIRXKRu8D81gT2bwNxYaDJ2";

let rawEmail = env.NEXT_PUBLIC_EMAIL || env.Next_PUBLIC_EMAIL || "alexandreroxkia@gmail.com";
if (rawEmail.includes("@") && !rawEmail.includes(".")) {
  rawEmail = rawEmail.replace(/@([a-zA-Z0-9_-]+)$/, "@$1.com");
}
const adminEmail = rawEmail.trim();
const adminPassword = env.NEXT_PUBLIC_MDP || env.Next_PUBLIC_MDP || "Admin225!Otaku";

async function run() {
  try {
    console.log(`🔐 Authentification en tant qu'administrateur (${adminEmail})...`);
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log("✅ Authentifié ! Mise à jour du rôle utilisateur...");

    const userRef = doc(db, "users", targetUid);
    await setDoc(userRef, {
      role: "user",
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log(`\n✅ SUCCÈS : L'utilisateur ${targetUid} est désormais un simple utilisateur (role: 'user').`);
    console.log("👉 L'accès à /admin lui est désormais strictement interdit.");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Erreur :", err.message);
    if (err.message.includes("PERMISSION_DENIED")) {
      console.log("\n💡 Pensez à déployer les règles avec : npm run deploy:rules");
    }
    process.exit(1);
  }
}

run();
