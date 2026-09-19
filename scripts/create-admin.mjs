/**
 * Script de création / initialisation du compte Administrateur dédié
 * Usage : node scripts/create-admin.mjs [email] [password]
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

// 1. Lire .env pour charger la config Firebase
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
  console.warn("⚠️ Fichier .env non lu, utilisation des variables par défaut.");
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

let rawEmail = process.argv[2] || env.NEXT_PUBLIC_EMAIL || env.Next_PUBLIC_EMAIL || process.env.NEXT_PUBLIC_EMAIL || "admin@otaku225.ci";
let adminPassword = process.argv[3] || env.NEXT_PUBLIC_MDP || env.Next_PUBLIC_MDP || process.env.NEXT_PUBLIC_MDP || "Admin225!Otaku";

// Correction automatique si un point a sauté dans le domaine (ex: gmailcom -> gmail.com)
if (rawEmail.includes("@") && !rawEmail.includes(".")) {
  rawEmail = rawEmail.replace(/@([a-zA-Z0-9_-]+)$/, "@$1.com");
}
const adminEmail = rawEmail.trim();

console.log("🛡️ ───────────────────────────────────────────────────");
console.log("👑 Otaku225 — Création / Mise à jour du Compte Admin");
console.log("🛡️ ───────────────────────────────────────────────────");
console.log(`📧 Email    : ${adminEmail}`);
console.log(`🔑 Password : ${adminPassword}`);
console.log(`📌 Projet   : ${firebaseConfig.projectId}\n`);

async function run() {
  let user;

  try {
    // Tente de créer le compte
    console.log("1️⃣ Création du compte dans Firebase Auth...");
    const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    user = cred.user;
    console.log(`✅ Compte Auth créé avec succès ! UID = ${user.uid}`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("ℹ️ Ce compte existe déjà dans Firebase Auth. Connexion en cours...");
      const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      user = cred.user;
      console.log(`✅ Connecté avec succès ! UID = ${user.uid}`);
    } else {
      console.error("❌ Erreur Firebase Auth :", err.message);
      process.exit(1);
    }
  }

  // 2. Mettre à jour le profil Firebase Auth
  try {
    await updateProfile(user, {
      displayName: "Otaku Admin",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=OtakuAdmin"
    });
  } catch (e) {
    // ignore
  }

  // 3. Écrire le document utilisateur avec role: 'admin' dans Firestore
  console.log("2️⃣ Enregistrement du profil avec le rôle 'admin' dans Firestore...");
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: adminEmail,
      username: "admin_otaku",
      displayName: "Otaku Administrateur",
      role: "admin",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=OtakuAdmin",
      bio: "Compte Super Administrateur de la plateforme Otaku225.",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    console.log("✅ Document Firestore créé/mis à jour avec le rôle 'admin' !");
    console.log("\n🎉 Opération terminée avec succès !");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 Identifiants pour vous connecter :");
    console.log(`   👉 Email    : ${adminEmail}`);
    console.log(`   👉 Password : ${adminPassword}`);
    console.log(`   👉 URL      : http://localhost:3000/login`);
    console.log(`   👉 Admin    : http://localhost:3000/admin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur écriture Firestore :", err.message);
    if (err.message.includes("PERMISSION_DENIED")) {
      console.log("\n⚠️ Les règles de sécurité Cloud Firestore bloquent l'écriture du rôle 'admin'.");
      console.log("👉 Exécutez d'abord la commande de déploiement des règles :");
      console.log("   npm run deploy:rules");
      console.log("👉 Puis relancez :");
      console.log("   npm run create-admin\n");
    }
    process.exit(1);
  }
}

run();
