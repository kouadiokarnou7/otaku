"use client";

import { motion } from "framer-motion";

export default function SkeletonPostCard() {
  const pulse = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity },
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-[#0a0e27] via-[#0f1430] to-[#1a1f3a] border border-orange-500/10 rounded-2xl overflow-hidden p-5"
      {...pulse}
    >
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-11 h-11 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-32 mb-2" />
          <div className="h-3 bg-white/10 rounded w-20" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
      </div>

      {/* Image skeleton */}
      <div className="h-64 bg-white/10 rounded-xl mb-4" />

      {/* Actions skeleton */}
      <div className="flex gap-2">
        <div className="h-10 bg-white/10 rounded-lg flex-1" />
        <div className="h-10 bg-white/10 rounded-lg flex-1" />
        <div className="h-10 bg-white/10 rounded-lg flex-1" />
      </div>
    </motion.div>
  );
}
