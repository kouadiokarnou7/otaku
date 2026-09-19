"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import type { XPReward } from "@/lib/hooks/store/useXPSystem";

interface XPNotificationProps {
  rewards: XPReward[];
}

export default function XPNotification({ rewards }: XPNotificationProps) {
  return (
    <AnimatePresence>
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
        {rewards.map((reward, idx) => (
          <motion.div
            key={`${reward.type}-${idx}`}
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/90 to-orange-500/90 backdrop-blur border border-white/20 shadow-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Zap size={16} className="text-yellow-300" />
            </motion.div>
            <span className="text-sm font-bold text-white">{reward.message}</span>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
