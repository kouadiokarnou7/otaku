"use client";

import { Heart, MessageCircle, Bookmark } from "lucide-react";
import type { Post } from "./Types";
import { POST_TYPE_LABELS, RANK_COLORS } from "./Mockdata";

interface PostCardProps {
  post:  Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

export default function PostCard({ post, onLike, onSave }: PostCardProps) {
  const typeMeta = POST_TYPE_LABELS[post.type] ?? { label: post.type, color: "rgba(255,255,255,0.45)" };
  const rankColor = RANK_COLORS[post.user.rank] ?? "rgba(255,255,255,0.35)";

  return (
    <div
      style={{
        background:   "rgba(255,255,255,0.03)",
        border:       "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding:      16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width:          38,
            height:         38,
            borderRadius:   "50%",
            background:     "rgba(255,255,255,0.07)",
            display:        "grid",
            placeItems:     "center",
            fontWeight:     700,
            color:          "#fff",
            flexShrink:     0,
          }}
        >
          {post.user.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {post.user.username}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                background: rankColor,
                color: "rgba(0,0,0,0.75)",
                textTransform: "uppercase",
              }}
            >
              {post.user.rank}
            </span>
          </div>

          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
            <span>{post.createdAt}</span>
            <span style={{ margin: "0 6px" }}>•</span>
            <span style={{ color: typeMeta.color }}>{typeMeta.label}</span>
          </div>

          <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>
            {post.content}
          </p>

          {post.anime && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 12,
                padding: 10,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <img
                src={post.anime.cover}
                alt={post.anime.title}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {post.anime.title}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                  Anime lié
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={() => onLike(post.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  background: "transparent",
                  color: post.liked ? "#FF6B1A" : "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Heart size={14} />
                {post.likes}
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <MessageCircle size={14} />
                {post.comments}
              </button>
            </div>

            <button
              onClick={() => onSave(post.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: post.saved ? "#00D4FF" : "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Bookmark size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
