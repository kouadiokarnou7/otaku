// ============================================================
// components/ui/Message.tsx — Message de feedback animé
// ============================================================

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { FeedbackMessage } from "@/lib/types";

interface MessageProps {
  message: FeedbackMessage;
  autoDismiss?: number; // ms avant de disparaître (0 = pas d'auto-dismiss)
  onDismiss?: () => void;
}

const config = {
  success: {
    bg: "bg-emerald-950/60 border-emerald-500/40",
    text: "text-emerald-400",
    icon: "✅",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
  },
  error: {
    bg: "bg-red-950/60 border-red-500/40",
    text: "text-red-400",
    icon: "❌",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
  "": null,
};

export default function Message({ message, autoDismiss = 4000, onDismiss }: MessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message.text) {
      setVisible(false);
      return;
    }
    // Petit délai pour déclencher l'animation d'entrée
    const showTimer = setTimeout(() => setVisible(true), 50);

    if (autoDismiss > 0) {
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDismiss?.(), 300);
      }, autoDismiss);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    return () => clearTimeout(showTimer);
  }, [message, autoDismiss, onDismiss]);

  if (!message.text || message.type === "") return null;

  const style = config[message.type];
  if (!style) return null;

  return (
    <div
      className={cn(
        "mt-4 px-4 py-3 rounded-xl border text-sm font-medium",
        "flex items-center gap-3",
        "transition-all duration-300 ease-out",
        style.bg,
        style.text,
        style.glow,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      role="alert"
      aria-live="polite"
    >
      <span className="text-base">{style.icon}</span>
      <span className="flex-1">{message.text}</span>
      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onDismiss(), 300);
          }}
          className="text-current opacity-50 hover:opacity-100 transition-opacity ml-2"
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
    </div>
  );
}