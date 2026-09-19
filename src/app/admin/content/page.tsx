"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  Globe,
  Coins,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  INITIAL_MANGAS,
  INITIAL_SUBMISSIONS,
  type MangaItem,
  type MangaSubmission,
} from "@/lib/data/mangasData";

type ContentTab = "pending" | "published" | "add";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>("pending");
  const [submissions, setSubmissions] = useState<MangaSubmission[]>(INITIAL_SUBMISSIONS);
  const [mangas, setMangas] = useState<MangaItem[]>(INITIAL_MANGAS);

  // Formulaire d'ajout direct par l'admin
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newOrigin, setNewOrigin] = useState<MangaItem["origin"]>("manga_africain");
  const [newCountry, setNewCountry] = useState("Côte d'Ivoire 🇨🇮");
  const [newSynopsis, setNewSynopsis] = useState("");
  const [newPriceFCFA, setNewPriceFCFA] = useState("2500");
  const [newCoverUrl, setNewCoverUrl] = useState("");
  const [newGenres, setNewGenres] = useState("Action, Shōnen Africain");

  // Modal de prévisualisation d'une soumission
  const [inspectingSub, setInspectingSub] = useState<MangaSubmission | null>(null);

  // Valider une soumission de mangaka
  const handleApproveSubmission = (sub: MangaSubmission) => {
    // 1. Ajouter le manga validé dans le catalogue public
    const approvedManga: MangaItem = {
      id: `manga-approved-${Date.now()}`,
      title: sub.mangaTitle,
      slug: sub.mangaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      origin: "manga_africain",
      country: sub.country,
      flag: sub.country.includes("🇨🇮") ? "🇨🇮" : sub.country.includes("🇸🇳") ? "🇸🇳" : "🌍",
      coverUrl: sub.coverUrl,
      synopsis: sub.synopsis,
      genres: ["Shōnen Africain", "Action", "Fantaisie"],
      author: sub.mangakaName,
      status: "en_cours",
      rating: 5.0,
      views: 120,
      digitalVolumePrice: {
        currency: "FCFA",
        amount: sub.requestedDigitalPriceFCFA,
        volumeNumber: 1,
      },
      chapters: [
        {
          id: `ch-${Date.now()}`,
          number: sub.chapterNumber,
          title: sub.chapterTitle,
          releaseDate: "Aujourd'hui",
          isNew: true,
          pagesCount: sub.pagesCount,
          samplePages: [sub.coverUrl],
        },
      ],
    };

    setMangas((prev) => [approvedManga, ...prev]);

    // 2. Retirer ou marquer comme validé
    setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    setInspectingSub(null);

    toast.success(`Le manga « ${sub.mangaTitle} » est validé et désormais public pour tous les lecteurs !`);
  };

  // Rejeter une soumission
  const handleRejectSubmission = (subId: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== subId));
    setInspectingSub(null);
    toast.info("La soumission a été rejetée et le mangaka notifié.");
  };

  // Ajouter un manga manuellement
  const handleCreateManga = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    const createdManga: MangaItem = {
      id: `manga-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      origin: newOrigin,
      country: newCountry,
      coverUrl: newCoverUrl.trim() || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
      synopsis: newSynopsis.trim() || "Aucun synopsis renseigné.",
      genres: newGenres.split(",").map((g) => g.trim()),
      author: newAuthor.trim() || "Mangaka Partenaire",
      status: "en_cours",
      rating: 5.0,
      views: 0,
      digitalVolumePrice: {
        currency: "FCFA",
        amount: parseInt(newPriceFCFA, 10) || 2500,
        volumeNumber: 1,
      },
      chapters: [
        {
          id: `ch-init-${Date.now()}`,
          number: 1,
          title: "Chapitre 1 : Le Commencement",
          releaseDate: "Aujourd'hui",
          isNew: true,
          pagesCount: 20,
          samplePages: [],
        },
      ],
    };

    setMangas((prev) => [createdManga, ...prev]);
    setNewTitle("");
    setNewAuthor("");
    setNewSynopsis("");
    setNewCoverUrl("");
    setActiveTab("published");
    toast.success("Nouveau manga ajouté avec succès au catalogue !");
  };

  return (
    <div className="space-y-6">
      {/* ── En-tête Cockpit Administrateur ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Gestion des Mangas & Validation</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
              Admin Cockpit
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Validez les soumissions des mangakas africains, gérez les scans et fixez les prix des tomes numériques.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("add")}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-black hover:brightness-110 transition-all shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>Publier un Manga</span>
        </button>
      </div>

      {/* ── Onglets de Navigation Cockpit ── */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pending")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "pending"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-muted-foreground hover:text-white"
            }`}
        >
          <Clock size={15} />
          <span>En attente de validation</span>
          {submissions.length > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.2 text-[10px] font-extrabold text-black">
              {submissions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "published"
              ? "bg-primary text-white shadow-md shadow-violet-500/20"
              : "text-muted-foreground hover:text-white"
            }`}
        >
          <BookOpen size={15} />
          <span>Catalogue en ligne ({mangas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === "add"
              ? "bg-primary text-white shadow-md shadow-violet-500/20"
              : "text-muted-foreground hover:text-white"
            }`}
        >
          <Plus size={15} />
          <span>Nouveau Manga</span>
        </button>
      </div>

      {/* ── 1. Onglet : Soumissions des Mangakas à Valider ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/40">
              <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2 opacity-80" />
              <h3 className="text-sm font-bold text-white">Toutes les soumissions sont traitées !</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Dès qu&apos;un mangaka dépose un manga ou un chapitre, il apparaîtra ici pour examen.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {submissions.map((sub) => (
                <article
                  key={sub.id}
                  className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="flex gap-3.5">
                    <div className="relative size-20 shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
                      <Image
                        src={sub.coverUrl}
                        alt={sub.mangaTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          Chapitre {sub.chapterNumber}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{sub.country}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">{sub.mangaTitle}</h3>
                      <p className="text-xs text-muted-foreground">
                        Mangaka : <strong className="text-foreground">{sub.mangakaName}</strong>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Prix Tome souhaité : <strong className="text-emerald-400 font-bold">{sub.requestedDigitalPriceFCFA} FCFA</strong>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-foreground/80 mt-3 line-clamp-2 italic bg-background/50 p-2.5 rounded-xl border border-border/40">
                    « {sub.synopsis} »
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/60">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {sub.submittedAt}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInspectingSub(sub)}
                        className="px-3 py-1.5 rounded-xl border border-border/80 bg-card/80 hover:bg-card text-xs font-semibold text-white transition-all flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Examiner</span>
                      </button>
                      <button
                        onClick={() => handleApproveSubmission(sub)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-black transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Check size={13} strokeWidth={2.5} />
                        <span>Valider & Publier</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 2. Onglet : Catalogue Actif ── */}
      {activeTab === "published" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mangas.map((manga) => (
              <div
                key={manga.id}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur-sm hover:border-primary/40 transition-all"
              >
                <div className="relative size-16 shrink-0 rounded-xl overflow-hidden bg-muted border border-border">
                  <Image
                    src={manga.coverUrl}
                    alt={manga.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {manga.origin === "manga_africain" ? (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                        {manga.flag || "🌍"} Africain
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.2 rounded">
                        {manga.origin.toUpperCase()}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-400 font-bold ml-auto">
                      {manga.digitalVolumePrice?.amount} FCFA
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{manga.title}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{manga.author}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {manga.chapters.length} chapitres publiés • ⭐ {manga.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. Onglet : Ajouter un Manga Directement ── */}
      {activeTab === "add" && (
        <div className="max-w-2xl rounded-2xl border border-border/80 bg-card/80 p-5 sm:p-6 backdrop-blur-md">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus size={18} className="text-amber-400" />
            <span>Créer et Publier un Nouveau Manga</span>
          </h2>

          <form onSubmit={handleCreateManga} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Titre du Manga *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Kankouan 2"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Auteur / Mangaka
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="ex: Studio Ivoire Manga"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Origine de l&apos;œuvre
                </label>
                <select
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value as any)}
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                >
                  <option value="manga_africain">🌍 Manga Africain</option>
                  <option value="manhwa">🇰🇷 Manhwa (Corée)</option>
                  <option value="webtoon">📱 Webtoon</option>
                  <option value="manga">🇯🇵 Manga Classique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="Côte d'Ivoire 🇨🇮"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Prix Tome Numérique (FCFA)
                </label>
                <input
                  type="number"
                  value={newPriceFCFA}
                  onChange={(e) => setNewPriceFCFA(e.target.value)}
                  placeholder="2500"
                  className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                URL de l&apos;affiche de couverture
              </label>
              <input
                type="url"
                value={newCoverUrl}
                onChange={(e) => setNewCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Synopsis / Résumé
              </label>
              <textarea
                rows={3}
                value={newSynopsis}
                onChange={(e) => setNewSynopsis(e.target.value)}
                placeholder="Raconte l'histoire du manga..."
                className="w-full rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-black hover:brightness-110 transition-all shadow-md"
            >
              Enregistrer & Mettre en ligne
            </button>
          </form>
        </div>
      )}

      {/* ── Modal d'Inspection & Validation de Soumission ── */}
      <AnimatePresence>
        {inspectingSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    Soumission Mangaka
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-1">
                    {inspectingSub.mangaTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Par {inspectingSub.mangakaName} ({inspectingSub.mangakaEmail}) • {inspectingSub.country}
                  </p>
                </div>
                <button
                  onClick={() => setInspectingSub(null)}
                  className="p-1 rounded-xl text-muted-foreground hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-4 items-start bg-background/60 p-3 rounded-2xl border border-border/60">
                <div className="relative size-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={inspectingSub.coverUrl}
                    alt={inspectingSub.mangaTitle}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white">
                    {inspectingSub.chapterTitle} (Ch. {inspectingSub.chapterNumber})
                  </p>
                  <p className="text-muted-foreground">Pages vérifiées : {inspectingSub.pagesCount} planches</p>
                  <p className="text-emerald-400 font-bold">Prix Tome fixé : {inspectingSub.requestedDigitalPriceFCFA} FCFA</p>
                  <p className="text-muted-foreground text-[11px] pt-1 italic">{inspectingSub.synopsis}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleRejectSubmission(inspectingSub.id)}
                  className="px-4 py-2 rounded-xl border border-red-500/40 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={() => handleApproveSubmission(inspectingSub)}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-black transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Approuver & Publier</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
