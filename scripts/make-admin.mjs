/**
 * Script d'attribution du rôle Administrateur — Otaku225
 * Authentifié via Firebase SDK pour éviter toute erreur 403 REST.
 * Usage : npm run make-admin [UID]
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("🛡️ Initialisation du script d'administration Otaku225...\n");

// Charger la configuration depuis .env
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
  // défaut
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA5NF_gQ453NJE6DilAPcEeYPLgxxbRRwk",
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "otaku-tesy.firebaseapp.com",
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otaku-tesy",
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "otaku-tesy.firebasestorage.app",
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "363540337270",
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:363540337270:web:5fb280cc53fe18fe0a0557"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const targetUid = process.argv[2] || "bTPkElIRXKRu8D81gT2bwNxYaDJ2";

console.log(`📌 Projet cible Firebase : ${firebaseConfig.projectId}`);
console.log(`👤 UID cible             : ${targetUid}\n`);

async function run() {
  const adminEmail = "admin@otaku225.ci";
  const adminPass = "Admin225!Otaku";

  let adminUser;

  // 1. Authentification en tant qu'admin pour avoir les droits Firestore
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    adminUser = cred.user;
  } catch (err) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      try {
        const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        adminUser = cred.user;
      } catch (createErr) {
        console.warn("⚠️ Création compte admin échouée, tentative anonyme/directe :", createErr.message);
      }
    }
  }

  // 2. Mettre à jour le rôle de l'UID cible dans Firestore
  try {
    const targetRef = doc(db, "users", targetUid);
    await setDoc(targetRef, {
      role: "admin",
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ SUCCÈS : L'utilisateur ${targetUid} est désormais 'admin' !`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👉 Accès immédiat :");
    console.log("   • URL Admin : http://localhost:3000/admin/content");
    console.log("   • Menu profil : Clic sur '🛡️ Espace Admin'");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du rôle :", err.message);
    process.exit(1);
  }
}

run();
