import {z } from "zod";
import { isUsernameAvailable } from "./utils";
// ── Schéma Zod ───────────────────────────────────────────────
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Minimum 3 caractères")
      .max(15, "Maximum 15 caractères")
      .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et _ uniquement"),

    email: z.string().email("Email invalide"),

    password: z
      .string()
      .min(6)
      .regex(/[A-Z]/, "Majuscule requise")
      .regex(/[0-9]/, "Chiffre requis")
      .regex(/[";:,\/\\&!?\@#$%\*\(\)\-\_\+\=]/, "Caractère spécial"),

    confirmPassword: z.string(),

    avatar: z.string().optional(),
  })

  // 🔐 password match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

  // 🔥 username unique (ASYNC)
  .refine(
    async (data) => {
      return await isUsernameAvailable(data.username);
    },
    {
      message: "Pseudo déjà pris",
      path: ["username"],
    }
  );

  // connexion : email ou pseudo
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "L'email ou le pseudo est requis")
    .refine(
      (val) => {
        const isEmail    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isUsername = val.length >= 3 && /^[a-zA-Z0-9_]+$/.test(val);
        return isEmail || isUsername;
      },
      { message: "Entrez un email valide ou un pseudo (min. 3 caractères)" }
    ),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Minimum 6 caractères"),
});