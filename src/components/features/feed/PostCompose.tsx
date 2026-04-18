"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Image as ImageIcon, Send, X } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface PostComposerProps {
  user: UserProfile;
  onSubmit: (content: string, mediaUrl?: string) => Promise<void>;
  onCancel?: () => void;
}

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
      await onSubmit(content, undefined); // TODO: upload image → mediaUrl
      setContent("");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants pour le responsive
  // Mobile : slide du bas | Desktop : fade + scale
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
      {/* Backdrop (Fond assombri) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onCancel}
      />

      {/* Conteneur du Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
        
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto w-full md:max-w-lg bg-gradient-to-br from-[#0a0e27] via-[#0f1430] to-[#1a1f3a] border-t-2 md:border border-orange-500/20 rounded-t-3xl md:rounded-2xl shadow-2xl shadow-orange-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle pour mobile (la petite barre de traction) */}
          <div className="flex justify-center pt-3 md:hidden">
            <div className="w-10 h-1 bg-orange-500/30 rounded-full" />
          </div>

          <div className="p-4 md:p-6">
            {/* Header Optionnel (fermeture sur desktop) */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">📝 Créer un post</h2>
              <button onClick={onCancel} className="text-gray-500 hover:text-orange-400 transition">
                <X size={20} />
              </button>
            </div>

            {/* Contenu du formulaire */}
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <Image
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random&size=64`}
                  alt={user.displayName}
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-orange-500/40 ring-2 ring-orange-500/10"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Partage ta passion pour l'anime... ✨"
                  rows={3}
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none"
                  autoFocus
                />
                
                {preview && (
                  <div className="mt-3 relative inline-block">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={200}
                      height={160}
                      className="max-h-40 rounded-lg border-2 border-orange-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-500/10">
                  <div className="flex gap-2">
                    <label className="cursor-pointer p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition">
                      <ImageIcon size={20} />
                      <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                    </label>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSubmit}
                    disabled={loading || (!content.trim() && !preview)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                             bg-gradient-to-r from-orange-500 to-orange-600 
                             hover:from-orange-600 hover:to-orange-700
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:bg-gray-500
                             shadow-[0_4px_15px_rgba(255,107,26,0.4)]
                             transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⌛</span>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Publier
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