"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/store/auth/useauth";

interface StoryItem {
  id: string;
  username: string;
  avatarUrl: string;
  hasUnseenStory?: boolean;
}

// Données démo pour les stories de la communauté Nekama
const DEMO_STORIES: StoryItem[] = [
  {
    id: "1",
    username: "kira_uchiha",
    avatarUrl: "https://ui-avatars.com/api/?name=Kira+Uchiha&background=8B5CF6&color=fff&size=150",
    hasUnseenStory: true,
  },
  {
    id: "2",
    username: "manga_fan",
    avatarUrl: "https://ui-avatars.com/api/?name=Manga+Fan&background=EC4899&color=fff&size=150",
    hasUnseenStory: true,
  },
  {
    id: "3",
    username: "luffy_225",
    avatarUrl: "https://ui-avatars.com/api/?name=Luffy+225&background=EF4444&color=fff&size=150",
    hasUnseenStory: false,
  },
  {
    id: "4",
    username: "otaku_girl",
    avatarUrl: "https://ui-avatars.com/api/?name=Otaku+Girl&background=3B82F6&color=fff&size=150",
    hasUnseenStory: true,
  },
  {
    id: "5",
    username: "gojo_fan",
    avatarUrl: "https://ui-avatars.com/api/?name=Gojo+Satoru&background=06B6D4&color=fff&size=150",
    hasUnseenStory: false,
  },
];

/**
 * Barre de Stories horizontales conforme à l'écran d'accueil Nekama.
 * Affiche la story de l'utilisateur ("Votre story") ainsi que les stories actives
 * de la communauté avec anneau dégradé néon violet.
 */
export default function StoryBar() {
  const { user } = useAuth();

  const userAvatar =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.displayName || "Moi"
    )}&background=8B5CF6&color=fff&size=100`;

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-3 px-1 min-w-max">
        {/* ── Story personnelle ("Votre story") ── */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
        >
          <div className="relative">
            <div className="size-14 rounded-full p-[2px] border-2 border-dashed border-primary/50 flex items-center justify-center">
              <div className="relative size-full rounded-full overflow-hidden">
                <Image
                  src={userAvatar}
                  alt="Votre story"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Badge "+" violet */}
            <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-white shadow-md border border-[#0a0e27]">
              <Plus size={11} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground tracking-tight max-w-[64px] truncate text-center">
            Votre story
          </span>
        </motion.div>

        {/* ── Stories de la communauté ── */}
        {DEMO_STORIES.map((story) => (
          <motion.div
            key={story.id}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
          >
            <div className="relative">
              {/* Cercle avec anneau dégradé violet / cyan si story non vue */}
              <div
                className={`size-14 rounded-full p-[2.5px] transition-all ${
                  story.hasUnseenStory
                    ? "bg-gradient-to-tr from-violet-600 via-[#8B5CF6] to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                    : "bg-border/60"
                }`}
              >
                <div className="size-full rounded-full p-[2px] bg-[#0a0e27]">
                  <div className="relative size-full rounded-full overflow-hidden">
                    <Image
                      src={story.avatarUrl}
                      alt={story.username}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-white/90 tracking-tight max-w-[64px] truncate text-center">
              {story.username}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
