import { BarChart3, Users, FileText, Shield } from "lucide-react";

// Les teintes viennent des tokens `tone-*` (globals.css), pas de hex en dur.
// Chaque entrée ne choisit qu'un nom de teinte : la valeur reste centralisée.
const STATS = [
  { label: "Utilisateurs", value: "2,543",  icon: Users,     tone: "brand" },
  { label: "Posts",        value: "8,234",  icon: FileText,  tone: "blue"  },
  { label: "Modérations",  value: "45",     icon: Shield,    tone: "red"   },
  { label: "Vues",         value: "128.5K", icon: BarChart3, tone: "green" },
] as const;

// Tailwind ne peut pas construire les classes dynamiquement (`bg-tone-${x}`) :
// le compilateur lit le source en statique. D'où cette table explicite.
const TONE: Record<(typeof STATS)[number]["tone"], string> = {
  brand: "bg-tone-brand/12 text-tone-brand",
  blue:  "bg-tone-blue/12 text-tone-blue",
  red:   "bg-tone-red/12 text-tone-red",
  green: "bg-tone-green/12 text-tone-green",
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de la communauté Otaku&nbsp;225
        </p>
      </header>

      {/* Statistiques */}
      <section
        aria-label="Statistiques"
        className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STATS.map(({ label, value, icon: Icon, tone }) => (
          <article
            key={label}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-border"
          >
            <div
              className={`mb-4 flex size-11 items-center justify-center rounded-lg ${TONE[tone]}`}
            >
              <Icon size={22} strokeWidth={1.9} />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {value}
            </p>
          </article>
        ))}
      </section>

      {/* Accès rapide Manga & Soumissions */}
      <section className="mb-10 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-background p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              <span>⚡ Espace Mangaka & Scans</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Validation des Chapitres & Catalogue Manga
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Inspectez et validez les œuvres soumises par les mangakas ivoiriens et africains avant publication. Gérez les prix des tomes numériques en FCFA.
            </p>
          </div>
          <a
            href="/admin/content"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all shrink-0"
          >
            Ouvrir le Cockpit Manga →
          </a>
        </div>
      </section>

      {/* Activité récente */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Activité récente
        </h2>
        <p className="text-sm text-muted-foreground">
          Les données d&apos;activité seront affichées ici…
        </p>
      </section>
    </div>
  );
}
