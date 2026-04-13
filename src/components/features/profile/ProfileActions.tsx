// components/profile/ProfileActions.tsx
import { cn } from "@/lib/utils";
import type { ProfileStats } from "@/lib/types";
import { calculateLevel, getNextLevelXp } from "@/lib/types";

interface ProfileActionsProps {
  stats: ProfileStats;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  value,
  label,
  icon,
  highlight = false,
}: {
  value: number | string;
  label: string;
  icon?: string;
  highlight?: boolean;
}) {
  const formatted = typeof value === "number" 
    ? value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value)
    : value;

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-[70px]">
      {icon && <span className="text-lg">{icon}</span>}
      <span
        className={cn(
          "text-lg sm:text-xl font-black leading-tight",
          highlight ? "text-violet-400" : "text-white"
        )}
      >
        {formatted}
      </span>
      <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">
        {label}
      </span>
    </div>
  );
}

// ── Badge Display ────────────────────────────────────────────
function BadgeDisplay({ badge }: { badge: ProfileStats["badge"] }) {
  if (!badge) return <span className="text-gray-500 text-sm">Aucun badge</span>;
  
  return (
    <div className="flex items-center gap-2 bg-[#1a2040] px-3 py-1.5 rounded-full border border-[#2D3748]">
      <span className="text-lg">{badge.icon}</span>
      <span className={cn("text-sm font-semibold", `text-${badge.color}-400`)}>
        {badge.name}
      </span>
    </div>
  );
}

// ── Progression Bar ──────────────────────────────────────────
function ProgressionBar({ xp, level }: { xp: number; level: number }) {
  const currentLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = getNextLevelXp(level);
  const progress = Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100);

  return (
    <div className="bg-[#090d22] border border-[#1e2540] rounded-xl p-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>Niveau {level}</span>
        <span>{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="h-2 bg-[#1a2040] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-500 mt-1.5 text-center">
        +{nextLevelXp - xp} XP pour le niveau {level + 1}
      </p>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function ProfileActions({
  stats,
  isEditing,
  loading,
  onEdit,
  onCancel,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Progression */}
      <ProgressionBar xp={stats.xp} level={stats.level} />

      {/* Stats bar */}
      <div className="flex items-center justify-around bg-[#090d22] border border-[#1e2540] rounded-2xl p-4 gap-2">
        <StatCard value={stats.animesCount} label="Animés" icon="🎬" highlight />
        <div className="w-px h-10 bg-[#2D3748]" />
        <StatCard value={stats.gamesCount} label="Jeux" icon="🎮" />
        <div className="w-px h-10 bg-[#2D3748]" />
        <StatCard value={stats.postsCount} label="Posts" icon="📝" />
        <div className="w-px h-10 bg-[#2D3748]" />
        <StatCard value={stats.rank} label="Rang" icon="🏆" />
      </div>

      {/* Badge */}
      <div className="flex justify-center">
        <BadgeDisplay badge={stats.badge} />
      </div>

      {/* Boutons d'action - plus grands comme tu aimes 👍 */}
      <div className="flex gap-3 flex-wrap">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={cn(
                "flex-1 min-w-[140px] min-h-[52px] px-4", // ✅ Boutons plus grands
                "flex items-center justify-center gap-2",
                "bg-[#1a2040] hover:bg-[#222a50]",
                "text-gray-400 hover:text-white text-sm font-semibold",
                "border border-[#2D3748] hover:border-orange-500/30", // ✅ Orange au hover
                "rounded-xl transition-all duration-200",
                "disabled:opacity-50"
              )}
            >
              ✕ Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 min-w-[140px] min-h-[52px] px-4",
                "flex items-center justify-center gap-2",
                "bg-orange-600 hover:bg-orange-500 active:bg-orange-700", // ✅ Orange pour l'action principale
                "text-white text-sm font-semibold",
                "border border-orange-500/40",
                "rounded-xl transition-all duration-200",
                "shadow-[0_0_20px_rgba(234,88,12,0.3)]",
                "hover:shadow-[0_0_28px_rgba(234,88,12,0.5)]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>💾 Enregistrer</>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className={cn(
              "w-full min-h-[52px] px-4",
              "flex items-center justify-center gap-2",
              "bg-orange-600/10 hover:bg-orange-600/20",
              "text-orange-400 hover:text-orange-300 text-sm font-semibold",
              "border border-orange-500/30 hover:border-orange-500/60",
              "rounded-xl transition-all duration-200",
              "hover:shadow-[0_0_16px_rgba(234,88,12,0.2)]"
            )}
          >
            ✏️ Modifier le profil
          </button>
        )}
      </div>
    </div>
  );
}