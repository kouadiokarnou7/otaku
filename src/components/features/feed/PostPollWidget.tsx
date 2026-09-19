"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2 } from "lucide-react";
import type { PostPoll } from "@/lib/types";

interface PostPollWidgetProps {
  poll: PostPoll;
  onVote?: (optionId: string) => void;
}

export default function PostPollWidget({ poll: initialPoll, onVote }: PostPollWidgetProps) {
  const [poll, setPoll] = useState<PostPoll>(initialPoll);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    initialPoll.userVotedOptionId || null
  );

  const hasVoted = Boolean(selectedOptionId);
  const totalVotes = Math.max(poll.totalVotes, 1);

  const handleSelectOption = (optionId: string) => {
    if (hasVoted) return;

    setSelectedOptionId(optionId);
    setPoll((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));

    onVote?.(optionId);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-[#0a0e27]/80 p-3.5 space-y-3 shadow-inner">
      {/* ── En-tête du sondage ── */}
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <BarChart3 size={15} />
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug flex-1">
          {poll.question}
        </h4>
      </div>

      {/* ── Options de vote ── */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const percentage = Math.round((option.votes / totalVotes) * 100);

          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={hasVoted}
              onClick={() => handleSelectOption(option.id)}
              whileTap={!hasVoted ? { scale: 0.98 } : {}}
              className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/20 text-white font-bold"
                  : "border-border/70 bg-card/60 text-foreground/90 hover:border-primary/40 hover:bg-card"
              }`}
            >
              {/* Jauge de pourcentage animée en arrière-plan */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-600/40 to-primary/50"
                      : "bg-white/10"
                  }`}
                />
              )}

              {/* Contenu de la ligne */}
              <div className="relative flex items-center justify-between gap-2 z-10 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {isSelected ? (
                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                  ) : (
                    <span className="size-3.5 rounded-full border border-border/80 shrink-0" />
                  )}
                  <span className="truncate">{option.text}</span>
                </div>

                {hasVoted && (
                  <span className="font-bold text-xs tabular-nums text-white shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Pied de sondage : total de votes ── */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
        <span>{poll.totalVotes} votes enregistrés</span>
        <span className="text-primary/90 font-medium">Sondage communautaire 🎌</span>
      </div>
    </div>
  );
}
