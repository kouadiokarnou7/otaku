"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Heart,
  Calendar,
  User,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import type { Post } from "@/lib/types";
import { toast } from "sonner";

export default function ModerationPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "media" | "polls">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🔄 Écoute en temps réel de tous les posts de la plateforme
  useEffect(() => {
    setLoading(true);
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("metadata.createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Post[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            uid: data.uid || "",
            username: data.username || "Otaku Anonyme",
            photoURL: data.photoURL || null,
            content: data.content || "",
            mediaUrl: data.mediaUrl || null,
            poll: data.poll || undefined,
            stats: data.stats || { likes: 0, comments: 0, shares: 0 },
            metadata: {
              createdAt: data.metadata?.createdAt?.toDate
                ? data.metadata.createdAt.toDate()
                : new Date(),
              visibility: data.metadata?.visibility || "public",
              tags: data.metadata?.tags || [],
            },
          });
        });
        setPosts(list);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Erreur écoute flux posts :", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Action : Supprimer définitivement un post en tant qu'administrateur
  const handleDeletePost = async (postId: string) => {
    setDeletingId(postId);
    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("Publication supprimée de la plateforme avec succès");
    } catch (err: any) {
      console.error("❌ Erreur suppression admin :", err);
      toast.error("Erreur lors de la suppression : " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtrage des posts
  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.uid.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (activeFilter === "media") return !!post.mediaUrl;
    if (activeFilter === "polls") return !!post.poll;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      {/* ── En-tête ── */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <Shield size={14} />
            <span>Cockpit d'Administration</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
            Gestion du Feed & Modération
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Contrôlez, inspectez et modérez l'ensemble des publications de la communauté en temps réel.
          </p>
        </div>

        <Link
          href="/feed"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-xs font-bold text-white transition-all shadow-md no-underline shrink-0"
        >
          <Eye size={15} className="text-primary" />
          <span>Ouvrir le Feed Public</span>
        </Link>
      </header>

      {/* ── Métriques Rapides ── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Posts
          </p>
          <p className="text-2xl font-black text-white mt-1">{posts.length}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Flux Firestore en direct</span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Avec Médias
          </p>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {posts.filter((p) => !!p.mediaUrl).length}
          </p>
          <span className="text-[10px] text-muted-foreground font-medium">Images & illustrations</span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Sondages Actifs
          </p>
          <p className="text-2xl font-black text-violet-400 mt-1">
            {posts.filter((p) => !!p.poll).length}
          </p>
          <span className="text-[10px] text-muted-foreground font-medium">Questions & avis</span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Statut Modération
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">Opérationnel</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">Zéro arriéré critique</span>
        </div>
      </section>

      {/* ── Barre de Contrôle (Recherche & Filtres) ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card/70 border border-border/80 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par texte, pseudo ou UID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background/80 border border-border/70 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeFilter === "all"
                ? "bg-primary text-white"
                : "bg-muted/40 text-muted-foreground hover:text-white"
              }`}
          >
            Tous ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("media")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeFilter === "media"
                ? "bg-primary text-white"
                : "bg-muted/40 text-muted-foreground hover:text-white"
              }`}
          >
            🖼️ Médias ({posts.filter((p) => !!p.mediaUrl).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("polls")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeFilter === "polls"
                ? "bg-primary text-white"
                : "bg-muted/40 text-muted-foreground hover:text-white"
              }`}
          >
            📊 Sondages ({posts.filter((p) => !!p.poll).length})
          </button>
        </div>
      </div>

      {/* ── Table / Liste de Modération ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <RefreshCw size={24} className="animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Chargement des publications du flux...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/30">
          <p className="text-sm font-bold text-white">Aucune publication trouvée</p>
          <p className="text-xs text-muted-foreground mt-1">
            Modifiez vos filtres ou effectuez une autre recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm transition-all hover:border-border"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                {/* Info Auteur & Contenu */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="relative size-10 rounded-full overflow-hidden border border-primary/40 bg-primary/20 shrink-0">
                    <Image
                      src={
                        post.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          post.username || "Otaku"
                        )}&background=8B5CF6&color=fff&size=80`
                      }
                      alt={post.username}
                      fill
                      sizes="40px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">{post.username}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                        UID: {post.uid.slice(0, 10)}…
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {post.metadata?.createdAt
                          ? new Date(post.metadata.createdAt).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "Date inconnue"}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed break-words whitespace-pre-line pt-0.5">
                      {post.content}
                    </p>

                    {/* Miniature si média attaché */}
                    {post.mediaUrl && (
                      <div className="pt-2">
                        <div className="relative h-28 w-44 rounded-xl overflow-hidden border border-border/80 bg-black/40">
                          <Image
                            src={post.mediaUrl}
                            alt="Média attaché"
                            fill
                            sizes="176px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Aperçu sondage si attaché */}
                    {post.poll && (
                      <div className="pt-2">
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-[11px] text-muted-foreground max-w-md">
                          <span className="font-bold text-amber-300">📊 Sondage :</span> {post.poll.question} ({post.poll.options.length} options, {post.poll.totalVotes || 0} votes)
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="text-red-400" />
                        {post.stats.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} className="text-violet-400" />
                        {post.stats.comments} comms
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        ID: {post.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions de Modération */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Confirmer la suppression définitive du post de "${post.username}" ?`)) {
                        handleDeletePost(post.id);
                      }
                    }}
                    disabled={deletingId === post.id}
                    title="Supprimer immédiatement cette publication"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    <span>{deletingId === post.id ? "Suppression..." : "Supprimer"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
