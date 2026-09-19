"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, X, CheckCircle2, Sparkles } from "lucide-react";

interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "suggestion", label: "💡 Suggestion" },
  { id: "bug", label: "🐛 Bug rencontré" },
  { id: "love", label: "❤️ Coup de cœur" },
  { id: "design", label: "🎨 Design / UI" },
];

export default function BetaFeedbackModal({ isOpen, onClose }: BetaFeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("suggestion");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Sauvegarde locale provisoire pour la phase de test (en attendant le hook Firestore)
    try {
      const existing = JSON.parse(localStorage.getItem("nekama_beta_feedback") || "[]");
      existing.push({
        rating,
        category,
        feedback: feedback.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem("nekama_beta_feedback", JSON.stringify(existing));
    } catch {
      // Ignorer silencieusement si localStorage n'est pas disponible
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback("");
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            className="relative w-full max-w-md rounded-3xl border border-primary/30 bg-[#0a0e27] p-6 shadow-2xl shadow-violet-500/20 text-foreground z-10"
          >
            {/* Bouton fermeture */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-xl bg-card/60 text-muted-foreground hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h3 className="font-heading text-lg font-bold text-white">Merci pour ton avis ! 🎌</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Ton retour nous aide directement à perfectionner Nekama pour la communauté otaku.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* En-tête */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">
                    <Sparkles size={12} />
                    <span>Premiers tests Bêta</span>
                  </div>
                  <h2 className="font-heading text-lg font-black text-white">
                    Donne ton avis sur Nekama
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Une idée, un bug ou une suggestion ? Ton avis compte énormément !
                  </p>
                </div>

                {/* Évaluation par étoiles */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-white">Note globale</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          size={24}
                          className={`transition-colors ${
                            (hoverRating ?? rating) >= star
                              ? "fill-[#FBBF24] text-[#FBBF24]"
                              : "text-border/80"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catégories de retour */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Type de retour</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          category === cat.id
                            ? "bg-primary text-white shadow-sm shadow-violet-500/20"
                            : "border border-border/80 bg-card/60 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Champ texte */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white">Ton message</label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Dis-nous ce que tu aimes, ce qui manque ou ce qu'on peut améliorer..."
                    required
                    className="w-full rounded-2xl border border-border/80 bg-card/70 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!feedback.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>Envoyer mon avis</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
