"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

interface PublishFABProps {
  onClick?: () => void;
}

export default function PublishFAB({ onClick }: PublishFABProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Publier un post"
      // bottom-22 : au-dessus de la BottomBar (h-16) + marge.
      className="fixed bottom-[84px] right-4 z-40 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-[#8B5CF6] to-indigo-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.45)] md:hidden"
    >
      <PenLine size={20} strokeWidth={2.2} />
    </motion.button>
  );
}
