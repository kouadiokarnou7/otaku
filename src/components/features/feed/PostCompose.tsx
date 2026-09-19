"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Image as ImageIcon, Send, X, Sparkles } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface PostComposerProps {
  user: UserProfile;
  onSubmit: (content: string, mediaUrl?: string) => Promise<void>;
  onCancel?: () => void;
}

const QUICK_EMOJIS = ["😍", "🔥", "👑", "💀", "🌙"];

export default function PostComposer({ user, onSubmit, onCancel }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !preview) return;
    setLoading(true);
    try {
      await onSubmit(content, preview || undefined);
      setContent("");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants: Variants = {
    hidden: { 
      y: "100%", 
      opacity: 0,
      scale: 0.95 
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring" as const, damping: 25, stiffness: 300 }
    },
    exit: { 
      y: "100%", 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="post-compose-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        onClick={onCancel}
      />

      <div
        key="post-compose-modal-container"
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto w-full md:max-w-lg bg-[#0a0e27] border-t md:border border-border/80 rounded-t-3xl md:rounded-3xl shadow-2xl shadow-violet-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle mobile */}
          <div className="flex justify-center pt-3 md:hidden">
            <div className="w-10 h-1 bg-border/60 rounded-full" />
          </div>

          <div className="p-4 md:p-6 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h2 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                Créer une publication
              </h2>
              <button
                onClick={onCancel}
                className="text-muted-foreground hover:text-white transition p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Auteur + Textarea */}
            <div className="flex gap-3">
              <div className="relative size-10 shrink-0 rounded-full overflow-hidden border border-primary/40">
                <Image
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.displayName || "User"
                    )}&background=8B5CF6&color=fff&size=64`
                  }
                  alt={user.displayName}
                  fill
                  sizes="40px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Quoi de neuf, otaku ? "
                  rows={4}
                  className="w-full bg-card/60 rounded-2xl border border-border/70 p-3 text-white placeholder:text-muted-foreground text-xs focus:outline-none focus:border-primary/60 resize-none transition-all"
                  autoFocus
                />

                {/* Émojis rapides */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] text-muted-foreground">Réactions :</span>
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setContent((c) => c + " " + emoji)}
                      className="text-sm hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {preview && (
                  <div className="mt-2 relative inline-block rounded-xl overflow-hidden border border-border">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={220}
                      height={140}
                      className="max-h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="absolute top-1.5 right-1.5 size-6 bg-black/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-black"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-card/60 text-xs text-muted-foreground hover:text-white hover:border-primary/40 transition">
                    <ImageIcon size={15} className="text-primary" />
                    <span>Photo</span>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && !preview)}
                    className="flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold text-white
                             bg-gradient-to-r from-violet-600 via-primary to-indigo-600 
                             hover:from-violet-500 hover:to-indigo-500
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-md shadow-violet-500/25 transition-all"
                  >
                    {loading ? (
                      <span>Envoi…</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Publier</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}