"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OtakuEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  category: "Cosplay" | "Convention" | "Tournoi" | "Meetup";
  color: string;
}

const EVENTS: OtakuEvent[] = [
  {
    id: 1,
    title: "Japan Expo Abidjan 2026",
    date: "12 Octobre 2026",
    location: "Palais de la Culture, Abidjan 🇨🇮",
    description: "Le plus grand rassemblement de la pop-culture et de la culture japonaise en Côte d'Ivoire. Stands, cosplay, invités spéciaux.",
    image: "⛩️",
    category: "Convention",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 2,
    title: "Babi Cosplay Meetup",
    date: "20 Octobre 2026",
    location: "Parc des Bosquets, Cocody",
    description: "Rencontre informelle de cosplayers pour des séances photo, des partages d'astuces de craft et de la bonne humeur.",
    image: "🎭",
    category: "Cosplay",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Tournoi Dragon Ball FighterZ",
    date: "5 Novembre 2026",
    location: "Esport Arena, Yopougon",
    description: "Montre tes skills et affronte les meilleurs combattants de la place pour remporter le titre suprême et des cashprizes.",
    image: "🏆",
    category: "Tournoi",
    color: "from-yellow-500 to-amber-600",
  },
];

/**
 * Section Agenda d'Événements Otaku de Nekama.
 * Affiche l'agenda local de la Côte d'Ivoire avec des cartes en verre dépoli néon.
 * 
 * @component
 * @returns {JSX.Element} La section Événements.
 */
export default function EventsSection() {
  return (
    <section id="events" className="border-t border-white/5 px-[var(--px)] py-[var(--section-py)] relative overflow-hidden bg-[#07070A]">
      
      {/* Halo de lueur violet/cyan en arrière-plan */}
      <div className="absolute right-0 top-1/4 -z-10 size-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 -z-10 size-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-[1100px] relative z-10">
        
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl text-center md:text-left"
        >
          <p className="section-eyebrow text-[#FF3E00] flex items-center gap-2 font-bold tracking-widest text-xs uppercase mb-4 justify-center md:justify-start">
            <span className="h-0.5 w-8 bg-[#FF3E00]" aria-hidden="true" />
            Agenda Otaku
          </p>
          <h2 className="font-display text-[clamp(36px,7vw,68px)] leading-[0.95] text-white font-extrabold mt-2">
            Ne rate aucun <span className="text-[#FF3E00] drop-shadow-[0_0_16px_rgba(255,62,0,0.15)]">rendez-vous</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-400">
            Conventions géantes, compétitions eSports ou rassemblements cosplays : retrouve tous les événements majeurs de la scène ivoirienne.
          </p>
        </motion.div>

        {/* Grille d'événements */}
        <div className="grid gap-6 md:grid-cols-3">
          {EVENTS.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-[#FF3E00]/40 shadow-lg shadow-black/20"
            >
              <div>
                {/* Badge Catégorie & Emoji */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-gradient-to-r ${event.color} text-white`}>
                    {event.category}
                  </span>
                  <div className="size-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl select-none group-hover:scale-110 transition-transform">
                    {event.image}
                  </div>
                </div>

                {/* Détails de l'événement */}
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FF3E00] transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Pied de carte avec icônes localisées */}
              <div className="mt-6 border-t border-white/5 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar size={12} className="text-[#FF3E00]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <MapPin size={12} className="text-[#00F5FF]" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bouton de redirection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-8 py-3 text-xs font-bold tracking-[0.08em] text-gray-400 uppercase transition-all hover:border-[#FF3E00]/40 hover:text-white hover:bg-[#FF3E00]/5"
          >
            Voir tous les événements
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
