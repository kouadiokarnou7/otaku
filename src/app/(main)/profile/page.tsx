"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/store/auth/useauth";
import { useProfile } from "@/lib/hooks/store/useProfile";
import { usePost } from "@/lib/hooks/store/usePost";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  PlayCircle,
  XCircle,
  LogOut,
  Trash2,
  Palette,
  AlertTriangle,
  X,
  Camera,
  ImagePlus,
  Loader2,
  Heart,
  Bookmark,
  MessageCircle,
  Shield,
} from "lucide-react";
import PostCard from "@/components/features/feed/Postcard";
import { THEME_COLORS, applyThemeColor, getSavedThemeColor } from "@/lib/theme/themeColors";
import { uploadAvatar } from "@/lib/firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { toast } from "sonner";
import { compressImage } from "@/lib/utils/imageCompressor";

const TABS = [
  { key: "posts", label: "Publications" },
  { key: "watchlist", label: "Collections" },
  { key: "activity", label: "Activité" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type WatchlistFilter = "watching" | "completed" | "dropped";
type ActivityFilter = "liked" | "saved" | "comments";

// Exemple de données pour la Watchlist (conforme Écran 9 Nekama)
const DEMO_WATCHLIST = [
  {
    id: "1",
    title: "Solo Leveling",
    currentEp: 12,
    totalEp: 12,
    status: "completed" as const,
    cover: "https://www.pinterest.com/pin/15621929952426812/",
  },
  {
    id: "2",
    title: "One Piece",
    currentEp: 1100,
    totalEp: 1100,
    status: "completed" as const,
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  },
  {
    id: "3",
    title: "Jujutsu Kaisen",
    currentEp: 47,
    totalEp: 47,
    status: "completed" as const,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
  },
  {
    id: "4",
    title: "Demon Slayer",
    currentEp: 36,
    totalEp: 55,
    status: "watching" as const,
    cover: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
  },
];

const OTAKU_PRESET_LOGOS = [
  { id: "luffy", name: "Luffy Gear 5", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luffy&backgroundColor=b6e3f4" },
  { id: "zoro", name: "Roronoa Zoro", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoro&backgroundColor=c0aede" },
  { id: "gojo", name: "Satoru Gojo", url: "https://api.dicebear.com/7.x/bottts/svg?seed=GojoSatoru&backgroundColor=ffd5dc" },
  { id: "sukuna", name: "Ryomen Sukuna", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Sukuna&backgroundColor=ffdfbf" },
  { id: "otaku-admin", name: "Otaku Super Admin", url: "https://api.dicebear.com/7.x/bottts/svg?seed=OtakuAdmin&backgroundColor=d1d4f9" },
  { id: "tanjiro", name: "Kamado Tanjiro", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Tanjiro&backgroundColor=d1f4d9" },
];

export default function UserProfilePage() {
  const params = useParams();
  const { user, isInitializing, logout, deleteAccount } = useAuth();
  const userId = (params?.userId as string | undefined) ?? user?.uid;
  const { profile, fetching } = useProfile(userId);
  const { posts, toggleLike, addComment, deletePost } = usePost(userId);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("posts");
  const [watchlistFilter, setWatchlistFilter] = useState<WatchlistFilter>("watching");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("liked");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  const handleSelectPresetLogo = async (logoUrl: string) => {
    if (!userId) return;
    setAvatarPreview(logoUrl);
    setShowLogoModal(false);
    try {
      localStorage.setItem(`nekama_avatar_${userId}`, logoUrl);
    } catch (e) {}

    try {
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { photoURL: logoUrl });
        } catch (e) {}
      }
      await setDoc(
        doc(db, "users", userId),
        { uid: userId, photoURL: logoUrl, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success("Logo Otaku appliqué avec succès !");
    } catch (err: any) {
      console.error("Erreur mise à jour logo :", err);
      toast.error("Erreur lors de la mise à jour du logo");
    }
  };

  useEffect(() => {
    if (!userId) return;
    try {
      const savedBanner = localStorage.getItem(`nekama_banner_${userId}`);
      if (savedBanner) {
        setBannerUrl(savedBanner);
      }
      const savedAvatar = localStorage.getItem(`nekama_avatar_${userId}`);
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    } catch (e) {
      console.warn("Erreur chargement images locales", e);
    }
  }, [userId]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 15 Mo.");
      e.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // 1. Compression et redimensionnement ultra-rapide côté client (320x320 px, ~25 Ko)
      const { base64, file: compressedFile } = await compressImage(file, 320, 0.82);

      // Aperçu instantané immédiat
      setAvatarPreview(base64);
      try {
        localStorage.setItem(`nekama_avatar_${userId}`, base64);
      } catch (err) {}

      // 2. Upload vers Firebase Storage avec repli ultra-rapide si indisponible
      let finalPhotoURL: string = base64;
      try {
        const storageUrl = await uploadAvatar(userId, compressedFile);
        if (storageUrl) {
          finalPhotoURL = storageUrl;
          setAvatarPreview(storageUrl);
          try {
            localStorage.setItem(`nekama_avatar_${userId}`, storageUrl);
          } catch (err) {}
        }
      } catch (storageErr) {
        console.warn("Firebase Storage indisponible ou lent, enregistrement local direct :", storageErr);
      }

      // 3. Mise à jour du profil Firebase Auth (uniquement avec URL HTTP pour ne pas déclencher auth/invalid-photo-url)
      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, { 
            photoURL: finalPhotoURL.startsWith("http") ? finalPhotoURL : undefined 
          });
        } catch (authErr) {
          console.warn("Auth updateProfile:", authErr);
        }
      }

      // 4. Enregistrement garanti dans Firestore
      await setDoc(
        doc(db, "users", userId),
        { uid: userId, photoURL: finalPhotoURL, updatedAt: serverTimestamp() },
        { merge: true }
      );

      toast.success("Photo de profil mise à jour avec succès !");
    } catch (err: any) {
      console.error("Erreur mise à jour avatar :", err);
      toast.error(err?.message || "Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      const { base64 } = await compressImage(file, 1200, 0.80);
      setBannerUrl(base64);
      try {
        localStorage.setItem(`nekama_banner_${userId}`, base64);
      } catch (err) {}
      toast.success("Image de fond mise à jour !");
    } catch (err) {
      console.warn("Erreur compression bannière :", err);
    }
  };

  if (isInitializing || fetching || !userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-xs text-muted-foreground">Chargement du profil…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Profil non trouvé</h2>
          <p className="text-xs text-muted-foreground mb-4">Ce compte n&apos;existe pas ou est privé.</p>
          <button
            onClick={() => router.back()}
            className="rounded-2xl bg-primary px-5 py-2 text-xs font-bold text-white"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.uid === userId;
  const userPosts = posts.filter((p) => p.uid === userId);

  // Filtrage de la watchlist
  const filteredWatchlist = DEMO_WATCHLIST.filter((item) => {
    if (watchlistFilter === "watching") return item.status === "watching";
    if (watchlistFilter === "completed") return item.status === "completed";
    return item.status === "dropped";
  });

  return (
    <div className="max-w-xl mx-auto pb-24 text-foreground">
      {/* ── 1. Bannière & Navigation Haute avec Image de fond personnalisée selon l'utilisateur ── */}
      <div
        className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#0d1238]"
        style={{
          backgroundImage: bannerUrl ? `url('${bannerUrl}')` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Image personnalisée par l'utilisateur ou ambiance d'attente */}
        {bannerUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bannerUrl}
            alt="Bannière personnalisée"
            className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/80 via-[#0a0e27] to-indigo-950/60 flex items-center justify-center">
            <div className="text-center opacity-40">
              <ImagePlus size={32} className="mx-auto mb-1 text-primary" />
              <p className="text-[11px] font-medium text-white">Personnalise ton image de fond</p>
            </div>
          </div>
        )}

        {/* Calque dégradé pour contraster avec l'avatar et les textes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0e27]" />
        
        {/* Barre d'action supérieure */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <button
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex size-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          {isOwnProfile && (
            <Link
              href="/settings"
              aria-label="Paramètres"
              className="flex size-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors no-underline"
            >
              <Settings size={18} />
            </Link>
          )}
        </div>

        {/* Bouton avec icône pour mettre un fond d'image selon l'utilisateur */}
        {isOwnProfile && (
          <label
            htmlFor="user-banner-upload"
            className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Mettre une image de fond selon vos préférences"
          >
            <Camera size={14} className="text-primary" />
            <span className="hidden sm:inline">Changer l&apos;image de fond</span>
            <input
              id="user-banner-upload"
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* ── 2. Avatar & En-tête Utilisateur (Écran 4) ── */}
      <div className="relative px-4 -mt-14 space-y-4">
        <div className="flex items-end justify-between">
          {/* Avatar cerclé avec badge icône de photo / caméra */}
          <div className="relative size-24 rounded-full p-[3px] bg-gradient-to-tr from-violet-600 via-primary to-fuchsia-500 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <div className="size-full rounded-full overflow-hidden bg-[#0a0e27] relative">
              <Image
                src={
                  avatarPreview ||
                  profile.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile.displayName || "Otaku"
                  )}&background=8B5CF6&color=fff&size=200`
                }
                alt={profile.displayName || "Avatar"}
                fill
                sizes="96px"
                loading="eager"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Badge icône photo / caméra pour changer la photo de profil */}
            {isOwnProfile && (
              <label
                htmlFor="user-avatar-upload"
                title="Changer la photo de profil"
                className="absolute -bottom-1 -right-1 z-20 flex size-8 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg cursor-pointer border-2 border-[#0a0e27] transition-all hover:scale-110 active:scale-95"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <Camera size={15} className="text-white" />
                )}
                <input
                  id="user-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </label>
            )}
          </div>

          {/* Boutons d'actions */}
          {isOwnProfile && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="flex items-center gap-1.5 rounded-2xl border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-all shadow-sm"
              >
                <Palette size={13} />
                <span>Logos Otaku</span>
              </button>

              <Link
                href="/settings"
                className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card/80 px-3.5 py-2 text-xs font-semibold text-white hover:border-primary/50 transition-all no-underline shadow-sm"
              >
                <Edit3 size={13} className="text-primary" />
                <span>Modifier</span>
              </Link>
            </div>
          )}
        </div>

        {/* Noms & Bio */}
        <div className="space-y-1">
          <h1 className="font-heading text-xl font-black tracking-tight text-white">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-xs text-primary/90 font-medium">
            @{profile.username || "kuro_otaku"}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {profile.bio ||
              "Passionné d'anime, de manga et de culture japonaise. Toujours à la recherche de nouvelles pépites !"}
          </p>
        </div>

        {/* Bouton d'accès direct Espace Admin pour les administrateurs */}
        {isOwnProfile && profile.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all no-underline shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  Espace Administrateur
                  <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded text-amber-300">Admin</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Gestion du contenu, validation des mangas et modération
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400">Ouvrir &rarr;</span>
          </Link>
        )}

        {/* ── 3. Compteurs de Statistiques (42 Animés, 18 Mangas, 356 Followers) ── */}
        <div className="flex items-center justify-around py-3 px-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
          <div className="text-center">
            <p className="font-heading text-base font-extrabold text-white">
              {profile.stats?.animesCount || 42}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">Animés</p>
          </div>
          <div className="h-6 w-px bg-border/60" />
          <div className="text-center">
            <p className="font-heading text-base font-extrabold text-white">
              {profile.stats?.gamesCount || 18}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">Mangas</p>
          </div>
          <div className="h-6 w-px bg-border/60" />
          <div className="text-center">
            <p className="font-heading text-base font-extrabold text-white">
              {profile.stats?.xp || 356}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">Followers</p>
          </div>
        </div>

        {/* ── 4. Onglets de Navigation (Publications, Collections, À propos) ── */}
        <div className="flex border-b border-border/70 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 pb-3 text-xs font-bold transition-all relative ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 inset-x-4 h-0.5 bg-primary shadow-[0_0_8px_var(--primary)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── 5. Contenu des Onglets ── */}
        <div className="pt-2">
          {/* Onglet Publications */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/30">
                  <p className="text-xs font-semibold text-white">Aucune publication pour le moment</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Partage ton avis ou un anime coup de cœur !</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserUid={user?.uid}
                    onLike={() => toggleLike(post.id, post.uid)}
                    onComment={(postId, text, options) => addComment(postId, text, { postAuthorUid: post.uid, ...options })}
                    onDelete={(postId) => deletePost(postId)}
                  />
                ))
              )}
            </div>
          )}

          {/* Onglet Collections / Watchlist (Écran 9) */}
          {activeTab === "watchlist" && (
            <div className="space-y-4">
              {/* Sous-filtres (En cours, Terminés, Abandonnés) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWatchlistFilter("watching")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    watchlistFilter === "watching"
                      ? "bg-primary text-white shadow-md shadow-violet-500/20"
                      : "border border-border/70 bg-card/60 text-muted-foreground"
                  }`}
                >
                  En cours
                </button>
                <button
                  onClick={() => setWatchlistFilter("completed")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    watchlistFilter === "completed"
                      ? "bg-primary text-white shadow-md shadow-violet-500/20"
                      : "border border-border/70 bg-card/60 text-muted-foreground"
                  }`}
                >
                  Terminés
                </button>
                <button
                  onClick={() => setWatchlistFilter("dropped")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    watchlistFilter === "dropped"
                      ? "bg-primary text-white shadow-md shadow-violet-500/20"
                      : "border border-border/70 bg-card/60 text-muted-foreground"
                  }`}
                >
                  Abandonnés
                </button>
              </div>

              {/* Liste animes de la Watchlist */}
              <div className="space-y-3">
                {filteredWatchlist.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/30">
                    <p className="text-xs font-semibold text-white">Aucun anime dans cette liste</p>
                  </div>
                ) : (
                  filteredWatchlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur-sm"
                    >
                      <div className="relative size-14 shrink-0 rounded-xl overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          Épisode {item.currentEp} / {item.totalEp}
                        </p>
                      </div>
                      <div>
                        {item.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#10B981]/15 px-2.5 py-1 text-[10px] font-bold text-[#10B981] border border-[#10B981]/25">
                            <CheckCircle2 size={11} />
                            Terminé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary border border-primary/25">
                            <PlayCircle size={11} />
                            En cours
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Onglet Activité — Style TikTok (Likés, Enregistrés, Commentaires) */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              {/* Sous-filtres TikTok : Likés, Enregistrés, Réponses */}
              <div className="flex items-center justify-around border-b border-border/60 pb-2">
                <button
                  type="button"
                  onClick={() => setActivityFilter("liked")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative ${
                    activityFilter === "liked" ? "text-primary" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Heart size={14} className={activityFilter === "liked" ? "fill-primary text-primary" : ""} />
                  <span>Likés</span>
                  {activityFilter === "liked" && (
                    <motion.div
                      layoutId="sub-activity-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActivityFilter("saved")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative ${
                    activityFilter === "saved" ? "text-primary" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Bookmark size={14} className={activityFilter === "saved" ? "fill-primary text-primary" : ""} />
                  <span>Enregistrés</span>
                  {activityFilter === "saved" && (
                    <motion.div
                      layoutId="sub-activity-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActivityFilter("comments")}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all relative ${
                    activityFilter === "comments" ? "text-primary" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <MessageCircle size={14} />
                  <span>Commentaires</span>
                  {activityFilter === "comments" && (
                    <motion.div
                      layoutId="sub-activity-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>

              {/* Contenu du sous-filtre actif */}
              {activityFilter === "liked" && (
                <div className="space-y-3">
                  {posts.filter((p) => p.likedByUser).length > 0 ? (
                    posts
                      .filter((p) => p.likedByUser)
                      .map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={() => toggleLike(post.id)}
                          onComment={(postId, text) => addComment(postId, text)}
                        />
                      ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/30 space-y-2">
                      <Heart size={24} className="mx-auto text-primary/60" />
                      <p className="text-xs font-semibold text-white">Aucun post liké pour le moment</p>
                      <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                        Aime des posts de la communauté dans ton fil d&apos;actualité pour les retrouver ici à tout moment !
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activityFilter === "saved" && (
                <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/30 space-y-2">
                  <Bookmark size={24} className="mx-auto text-primary/60" />
                  <p className="text-xs font-semibold text-white">Aucun post enregistré</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Clique sur le signet d&apos;un post pour le garder dans tes favoris privés !
                  </p>
                </div>
              )}

              {activityFilter === "comments" && (
                <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/30 space-y-2">
                  <MessageCircle size={24} className="mx-auto text-primary/60" />
                  <p className="text-xs font-semibold text-white">Aucune réponse rédigée</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Participe aux débats et donne ton avis sur les posts des autres otakus !
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de Sélection de Logo / Avatar Otaku ── */}
      <AnimatePresence>
        {showLogoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-primary" />
                  <h3 className="font-heading text-base font-bold text-white">Logos & Avatars Otaku</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoModal(false)}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Remplacez l'avatar Google par défaut par un logo Otaku officiel ou uploadez votre propre image.
              </p>

              {/* Grille des logos Otaku prédéfinis */}
              <div className="grid grid-cols-3 gap-3 py-2">
                {OTAKU_PRESET_LOGOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPresetLogo(item.url)}
                    className="group flex flex-col items-center gap-2 p-3 rounded-2xl border border-border/60 bg-background/50 hover:border-primary/60 hover:bg-primary/5 transition-all text-center cursor-pointer"
                  >
                    <div className="relative size-14 rounded-full overflow-hidden border border-border group-hover:border-primary/60 transition-all">
                      <Image src={item.url} alt={item.name} fill sizes="56px" unoptimized className="object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground group-hover:text-white transition-colors truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bouton d'upload direct d'image locale */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ou uploadez votre image :</span>
                <label
                  htmlFor="user-avatar-upload-modal"
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Choisir un fichier
                  <input
                    id="user-avatar-upload-modal"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setShowLogoModal(false);
                      handleAvatarChange(e);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
