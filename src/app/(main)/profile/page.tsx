"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, MessageCircle, Share2 } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;
  const { user, isInitializing } = useAuth();
  const { profile, fetching } = useProfile(userId);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "watchlist" | "about">("posts");

  // 🌀 États de chargement
  if (isInitializing || fetching || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/80 text-sm animate-pulse">
            Chargement du profil...
          </p>
        </div>
      </div>
    );
  }

  // ❌ Erreur si le profil n'existe pas
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Profil non trouvé</h2>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 mt-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.uid === userId;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#0f1430] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0e27]/95 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition"
        >
          ← Retour
        </button>
        {isOwnProfile && (
          <Link 
            href="/settings"
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Settings size={20} />
          </Link>
        )}
      </div>

      {/* Cover Image (optionnel) */}
      <div className="h-32 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 relative">
        <div className="absolute inset-0 backdrop-blur-xl" />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-4 -mt-16 mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-end gap-4 mb-4"
        >
          {/* Avatar */}
          {profile?.photoURL ? (
            <img 
              src={profile.photoURL} 
              alt={profile.displayName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0a0e27] shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-3xl font-bold border-4 border-[#0a0e27] shadow-xl">
              {profile?.displayName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          
          {/* Info rapide */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
            <p className="text-white/60 text-sm">@{profile?.username}</p>
            {profile?.bio && (
              <p className="text-white/70 text-sm mt-2">{profile.bio}</p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          {isOwnProfile ? (
            <>
              <Link
                href="/settings"
                className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-medium transition shadow-lg shadow-orange-500/20"
              >
                Éditer le profil
              </Link>
              <button className="py-2.5 px-4 border border-white/20 hover:bg-white/5 rounded-xl transition">
                ⚙️
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-medium transition shadow-lg shadow-orange-500/20 flex items-center gap-2 justify-center">
                <MessageCircle size={16} />
                Message
              </button>
              <button className="py-2.5 px-4 border border-white/20 hover:bg-white/5 rounded-xl transition">
                <Share2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 text-center"
          >
            <p className="text-2xl font-bold text-orange-400">{profile?.stats?.postsCount || 0}</p>
            <p className="text-xs text-white/60 mt-1">Posts</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 text-center"
          >
            <p className="text-2xl font-bold text-purple-400">{profile?.stats?.followersCount || 0}</p>
            <p className="text-xs text-white/60 mt-1">Followers</p>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 text-center"
          >
            <p className="text-2xl font-bold text-cyan-400">{profile?.stats?.followingCount || 0}</p>
            <p className="text-xs text-white/60 mt-1">Following</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-[#0a0e27]/95 backdrop-blur border-b border-white/10 px-4">
        <div className="flex gap-8">
          {(["posts", "watchlist", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-medium transition border-b-2 ${
                activeTab === tab
                  ? "text-orange-400 border-orange-400"
                  : "text-white/60 hover:text-white border-transparent"
              }`}
            >
              {tab === "posts" && "Publications"}
              {tab === "watchlist" && "Watchlist"}
              {tab === "about" && "À propos"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {activeTab === "posts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/40"
          >
            <p>Aucune publication pour le moment</p>
          </motion.div>
        )}

        {activeTab === "watchlist" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/40"
          >
            <p>Watchlist vide</p>
          </motion.div>
        )}

        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-white/70">{profile?.bio || "Aucune bio"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Membre depuis</h3>
              <p className="text-white/70">
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString("fr-FR")
                  : "N/A"
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
