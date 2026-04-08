// hooks/useRegister.ts
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase/firebaseconfig";
import { generateAvatar } from "@/lib/utils";
import { registerSchema } from "@/lib/validators";

const googleProvider = new GoogleAuthProvider();


// 🔥 username propre
function generateUsername(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 15);
}


// 🔥 username unique
async function generateUniqueUsername(base: string) {
  let username = base;
  let count = 0;

  while (true) {
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return username;

    count++;
    username = `${base}_${count}`;
  }
}


export function useRegister() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔐 INSCRIPTION EMAIL
  const registerdata = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const validated = registerSchema.parse(data);

      const res = await createUserWithEmailAndPassword(
        auth,
        validated.email,
        validated.password
      );

      const user = res.user;

      // username unique
      const baseUsername = generateUsername(validated.username);
      const username = await generateUniqueUsername(baseUsername);

      const avatar =
        validated.avatar ?? generateAvatar(username);

      await setDoc(doc(db, "users", user.uid), {
        username,
        email: validated.email,
        avatar: avatar ?? null,
        bio: "",
        createdAt: new Date(),
      });

      router.push("/feed");
      return user;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  // 🌐 GOOGLE SIGN-IN / SIGN-UP
  const registerWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // 🔥 username auto depuis Google
      const baseUsername = generateUsername(
        user.displayName || "otaku"
      );

      const username = await generateUniqueUsername(baseUsername);

      const avatar =
        user.photoURL || generateAvatar(username);

      // 🔥 create/update Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          username,
          email: user.email,
          avatar,
          bio: "",
          createdAt: new Date(),
          isOnboarded: false, // 🔥 utile plus tard
        },
        { merge: true }
      );

      router.push("/feed");
      return user;

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return {
    registerdata,
    registerWithGoogle, // 👈 AJOUT IMPORTANT
    loading,
    error,
  };
}