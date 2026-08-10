"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface XPReward {
  type: "post" | "like" | "comment" | "follow";
  amount: number;
  message: string;
}

const XP_REWARDS: Record<string, number> = {
  post: 100,
  like: 5,
  comment: 15,
  follow: 25,
};

export function useXPSystem(userId: string | undefined) {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [recentRewards, setRecentRewards] = useState<XPReward[]>([]);

  // Calculer le niveau basé sur l'XP
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 500) + 1;
  };

  // Ajouter de l'XP
  const addXP = useCallback(
    (type: keyof typeof XP_REWARDS, customMessage?: string) => {
      if (!userId) return;

      const amount = XP_REWARDS[type];
      const newTotal = totalXP + amount;
      const newLevel = calculateLevel(newTotal);

      setTotalXP(newTotal);

      // Notifier le level up
      if (newLevel > level) {
        setLevel(newLevel);
        toast.success(`🎉 Level up! Vous êtes maintenant niveau ${newLevel}`);
      }

      // Afficher le reward
      const message =
        customMessage || `+${amount} XP pour avoir ${type}é!`;
      const reward: XPReward = {
        type,
        amount,
        message,
      };

      setRecentRewards((prev) => [reward, ...prev.slice(0, 4)]);

      // Stocker dans Firestore (optionnel)
      // await updateDoc(doc(db, "users", userId), {
      //   xp: newTotal,
      //   level: newLevel,
      // });
    },
    [userId, totalXP, level]
  );

  return {
    totalXP,
    level,
    recentRewards,
    addXP,
  };
}
