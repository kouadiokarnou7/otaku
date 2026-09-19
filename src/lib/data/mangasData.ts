export interface MangaChapter {
  id: string;
  number: number;
  title: string;
  releaseDate: string;
  isNew?: boolean;
  pagesCount: number;
  samplePages: string[];
}

export interface MangaItem {
  id: string;
  title: string;
  slug: string;
  origin: "manga_africain" | "manhwa" | "webtoon" | "manga";
  country?: string;
  flag?: string;
  coverUrl: string;
  bannerUrl?: string;
  synopsis: string;
  genres: string[];
  author: string;
  status: "en_cours" | "termine";
  rating: number;
  views: number;
  digitalVolumePrice?: {
    currency: string; // 'FCFA'
    amount: number;
    volumeNumber: number;
  };
  chapters: MangaChapter[];
}

export interface MangaSubmission {
  id: string;
  mangaTitle: string;
  mangakaName: string;
  mangakaEmail: string;
  country: string;
  coverUrl: string;
  synopsis: string;
  chapterNumber: number;
  chapterTitle: string;
  submittedAt: string;
  status: "en_attente" | "valide" | "rejete";
  requestedDigitalPriceFCFA: number;
  pagesCount: number;
}

// ── Catalogue Public Initial (Scans RimuScan + Mangas Africains à l'honneur) ──
export const INITIAL_MANGAS: MangaItem[] = [
  {
    id: "manga-afrik-1",
    title: "Kankouan : Le Feu Ancestral",
    slug: "kankouan-le-feu-ancestral",
    origin: "manga_africain",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    coverUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80",
    synopsis: "Dans une Afrique mystique où les totems et masques sacrés confèrent des pouvoirs élémentaires surhumains, Kouamé, un jeune forgeron d'Abidjan, hérite de la flamme ancestrale de Kankouan convoitée par les ombres du passé.",
    genres: ["Shōnen Africain", "Action", "Mythologie", "Arts Martiaux"],
    author: "Kouadio & Studio 225",
    status: "en_cours",
    rating: 4.9,
    views: 14200,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 2500,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "kankouan-ch-3",
        number: 3,
        title: "L'Éveil du Masque d'Or",
        releaseDate: "18 sept.",
        isNew: true,
        pagesCount: 22,
        samplePages: [
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&q=85",
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&q=85",
        ],
      },
      {
        id: "kankouan-ch-2",
        number: 2,
        title: "Les Épreuves de Yamoussoukro",
        releaseDate: "10 sept.",
        isNew: false,
        pagesCount: 24,
        samplePages: [
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=85",
        ],
      },
      {
        id: "kankouan-ch-1",
        number: 1,
        title: "Le Sang du Forgeron",
        releaseDate: "01 sept.",
        isNew: false,
        pagesCount: 30,
        samplePages: [
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&q=85",
        ],
      },
    ],
  },
  {
    id: "manga-afrik-2",
    title: "Deïdo : L'Épée du Wouri",
    slug: "deido-l-epee-du-wouri",
    origin: "manga_africain",
    country: "Cameroun",
    flag: "🇨🇲",
    coverUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    synopsis: "Aux abords du fleuve Wouri, un ordre secret d'escrimeurs gardiens des esprits de l'eau s'oppose à une corporation cybernétique cherchant à piller les énergies fluviales.",
    genres: ["Cyber-Tradition", "Action", "Fantaisie"],
    author: "Yvan B. Manga",
    status: "en_cours",
    rating: 4.8,
    views: 9800,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 2000,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "deido-ch-2",
        number: 2,
        title: "Les Murmures du Fleuve",
        releaseDate: "15 sept.",
        isNew: true,
        pagesCount: 20,
        samplePages: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85"],
      },
      {
        id: "deido-ch-1",
        number: 1,
        title: "L'Héritier de Douala",
        releaseDate: "05 sept.",
        isNew: false,
        pagesCount: 26,
        samplePages: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85"],
      },
    ],
  },
  {
    id: "manga-rimu-1",
    title: "Murim Psychopath",
    slug: "murim-psychopath",
    origin: "manhwa",
    country: "Corée",
    flag: "🇰🇷",
    coverUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
    synopsis: "Un psychopathe unique en son genre est tombé dans le Murim à cause d'une erreur technique de déconnexion. Les crocs impitoyables de Dong Bongsu jettent une ombre terrifiante sur le monde des arts martiaux.",
    genres: ["Manhwa", "Action", "Murim", "Anti-Héros"],
    author: "Rimu Scan VF",
    status: "en_cours",
    rating: 4.95,
    views: 38400,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 3000,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "murim-ch-24",
        number: 24,
        title: "L'Ombre du Prédateur",
        releaseDate: "19 sept.",
        isNew: true,
        pagesCount: 18,
        samplePages: ["https://images.unsplash.com/photo-1563089145-599997674d42?w=900&q=85"],
      },
      {
        id: "murim-ch-23",
        number: 23,
        title: "Duel sous la Lune",
        releaseDate: "12 sept.",
        isNew: false,
        pagesCount: 18,
        samplePages: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=85"],
      },
    ],
  },
  {
    id: "manga-rimu-2",
    title: "Shadow Slave",
    slug: "shadow-slave",
    origin: "manhwa",
    country: "Corée",
    flag: "🇰🇷",
    coverUrl: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&q=80",
    synopsis: "Sunny, un orphelin sans avenir du monde éveillé, est projeté dans le cauchemar du Premier Sortilège. Pour survivre parmi les monstres et les dieux déchus, il doit embrasser le destin d'un esclave des ombres.",
    genres: ["Manhwa", "Dark Fantasy", "Survie", "Mystère"],
    author: "Guiltythree / Rimu VF",
    status: "en_cours",
    rating: 4.9,
    views: 45200,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 3500,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "shadow-ch-9",
        number: 9,
        title: "Le Rivage Oublié",
        releaseDate: "17 sept.",
        isNew: true,
        pagesCount: 19,
        samplePages: ["https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=900&q=85"],
      },
      {
        id: "shadow-ch-8",
        number: 8,
        title: "Le Chant des Ombres",
        releaseDate: "10 sept.",
        isNew: false,
        pagesCount: 20,
        samplePages: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=85"],
      },
    ],
  },
  {
    id: "manga-rimu-3",
    title: "Killer Pedro",
    slug: "killer-pedro",
    origin: "manhwa",
    country: "Corée",
    flag: "🇰🇷",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80",
    synopsis: "Pedro, le tueur à gages légendaire vieillissant, est trahi par son organisation. Miraculeusement rajeuni dans le corps d'un lycéen, il décide d'éliminer un à un ses anciens commanditaires.",
    genres: ["Action", "Vengeance", "Combat"],
    author: "Rimu Scan VF",
    status: "en_cours",
    rating: 4.85,
    views: 29100,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 2500,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "pedro-ch-135",
        number: 135,
        title: "L'Embuscade du Gang",
        releaseDate: "Aujourd'hui",
        isNew: true,
        pagesCount: 16,
        samplePages: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&q=85"],
      },
      {
        id: "pedro-ch-134",
        number: 134,
        title: "Règle de Fer",
        releaseDate: "09 sept.",
        isNew: false,
        pagesCount: 17,
        samplePages: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&q=85"],
      },
    ],
  },
  {
    id: "manga-rimu-4",
    title: "The Skeleton Soldier Failed to Defend the Dungeon",
    slug: "the-skeleton-soldier-failed-to-defend-the-dungeon",
    origin: "manhwa",
    country: "Corée",
    flag: "🇰🇷",
    coverUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80",
    synopsis: "Un simple squelette sans nom échoue à protéger sa maîtresse. Mais au lieu de périr définitivement, il se réveille 20 ans en arrière avec tous ses souvenirs et ses statistiques intactes.",
    genres: ["Dark Fantasy", "Boucle Temporelle", "RPG"],
    author: "Rimu Scan VF",
    status: "en_cours",
    rating: 4.9,
    views: 51200,
    digitalVolumePrice: {
      currency: "FCFA",
      amount: 3000,
      volumeNumber: 1,
    },
    chapters: [
      {
        id: "skeleton-ch-374",
        number: 374,
        title: "La Rage des Os",
        releaseDate: "Aujourd'hui",
        isNew: true,
        pagesCount: 21,
        samplePages: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&q=85"],
      },
      {
        id: "skeleton-ch-373",
        number: 373,
        title: "Renaissance sans Fin",
        releaseDate: "16 sept.",
        isNew: true,
        pagesCount: 20,
        samplePages: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&q=85"],
      },
    ],
  },
];

// ── Soumissions en Attente de Validation par l'Admin ──
export const INITIAL_SUBMISSIONS: MangaSubmission[] = [
  {
    id: "sub-1",
    mangaTitle: "Légende du Masque Baoulé",
    mangakaName: "Koffi Jean-Luc",
    mangakaEmail: "koffi.manga@gmail.com",
    country: "Côte d'Ivoire 🇨🇮",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    synopsis: "À Tiébissou, un adolescent découvre un masque sacré sculpté au XVIIIe siècle qui lui permet de voyager dans les souvenirs de ses aïeux pour protéger son village d'un péril ancien.",
    chapterNumber: 1,
    chapterTitle: "Le Réveil des Esprits",
    submittedAt: "19 sept. 2026 à 17:40",
    status: "en_attente",
    requestedDigitalPriceFCFA: 2000,
    pagesCount: 25,
  },
  {
    id: "sub-2",
    mangaTitle: "Les Chroniques du Sahel",
    mangakaName: "Amadou Diallo",
    mangakaEmail: "amadou.art@yahoo.fr",
    country: "Sénégal 🇸🇳",
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    synopsis: "Dans un futur où le désert abrite d'immenses cités solaires, une pilote nomade défend les caravanes d'eau contre les pillards des dunes.",
    chapterNumber: 1,
    chapterTitle: "Le Voleur de Tempête",
    submittedAt: "19 sept. 2026 à 14:15",
    status: "en_attente",
    requestedDigitalPriceFCFA: 2500,
    pagesCount: 28,
  },
];
