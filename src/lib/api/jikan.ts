/**
 * API Client pour Jikan (MyAnimeList)
 * Documentation: https://jikan.moe/api
 */

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// Types pour les réponses Jikan
export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis: string;
  type: string;
  episodes: number | null;
  status: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  genres: Array<{
    mal_id: number;
    name: string;
  }>;
  year: number | null;
}

export interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanCharacter {
  mal_id: number;
  name: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

/**
 * Rechercher des animes par terme
 */
export async function searchAnime(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<JikanSearchResponse> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?q=${encodedQuery}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Jikan: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur recherche anime:", error);
    throw error;
  }
}

/**
 * Récupérer les détails d'un anime par son ID MAL
 */
export async function getAnimeById(id: number): Promise<JikanAnime> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);

    if (!response.ok) {
      throw new Error(`Erreur Jikan: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("❌ Erreur récupération anime:", error);
    throw error;
  }
}

/**
 * Récupérer les animes du top (par popularité, score, etc.)
 */
export async function getTopAnimes(
  filter: "bypopularity" | "score" | "favorite" | "all" = "all",
  page: number = 1,
  limit: number = 10
): Promise<JikanSearchResponse> {
  try {
    const filterParam = filter !== "all" ? `&filter=${filter}` : "";
    const response = await fetch(
      `${JIKAN_BASE_URL}/top/anime?page=${page}&limit=${limit}${filterParam}`
    );

    if (!response.ok) {
      throw new Error(`Erreur Jikan: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur top animes:", error);
    throw error;
  }
}

/**
 * Récupérer les personnages d'un anime
 */
export async function getAnimeCharacters(id: number): Promise<JikanCharacter[]> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/anime/${id}/characters`);

    if (!response.ok) {
      throw new Error(`Erreur Jikan: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("❌ Erreur récupération personnages:", error);
    throw error;
  }
}

/**
 * Récupérer les animes de la saison actuelle
 */
export async function getCurrentSeasonAnimes(): Promise<JikanSearchResponse> {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/seasons/now?limit=25`);

    if (!response.ok) {
      throw new Error(`Erreur Jikan: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur saison actuelle:", error);
    throw error;
  }
}

/**
 * Fonction utilitaire pour extraire l'image optimale
 */
export function getBestImageUrl(anime: JikanAnime): string {
  return anime.images?.webp?.large_image_url || 
         anime.images?.jpg?.large_image_url || 
         anime.images?.jpg?.image_url || 
         "/placeholder-anime.jpg";
}
