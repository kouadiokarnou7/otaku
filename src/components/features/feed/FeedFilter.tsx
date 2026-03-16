"use client";

import { motion } from "framer-motion";
import type { FeedFilterType } from "./Index";

interface FeedFilterProps {
  active:   FeedFilterType;
  onChange: (filter: FeedFilterType) => void;
}

const FILTERS: { value: FeedFilterType; label: string }[] = [
  { value: "all",       label: "Tous"         },
  { value: "following", label: "Abonnements"  },
];

export default function FeedFilterBar({ active, onChange }: FeedFilterProps) {
  return (
    <div style={{
      display:      "flex",
      gap:          4,
      marginBottom: 12,
      background:   "rgba(255,255,255,0.02)",
      border:       "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding:      4,
    }}>
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              flex:         1,
              padding:      "8px 0",
              borderRadius: 9,
              border:       "none",
              background:   "transparent",
              color:        isActive ? "#fff" : "rgba(255,255,255,0.35)",
              fontSize:     13,
              fontWeight:   isActive ? 700 : 500,
              cursor:       "pointer",
              position:     "relative",
              transition:   "color .2s",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="feed-filter-bg"
                style={{
                  position:     "absolute",
                  inset:        0,
                  borderRadius: 9,
                  background:   "rgba(255,107,26,0.12)",
                  border:       "1px solid rgba(255,107,26,0.25)",
                  zIndex:       0,
                }}
                transition={{ type:"spring", stiffness:400, damping:30 }}
              />
            )}
            <span style={{ position:"relative", zIndex:1 }}>
              {f.label}
              {isActive && (
                <span style={{
                  display:      "inline-block",
                  marginLeft:   6,
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   "#FF6B1A",
                  verticalAlign:"middle",
                }} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}