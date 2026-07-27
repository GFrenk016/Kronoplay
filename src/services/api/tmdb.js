// -----------------------------------------------------------------------------
// Client TMDB — ricerca titoli e normalizzazione dati film/serie.
// -----------------------------------------------------------------------------
// L'API key viene letta da process.env.EXPO_PUBLIC_TMDB_API_KEY (vedi .env.example).
// Tutto ciò che riguarda la rete/TMDB vive qui: le screen non conoscono la forma
// grezza delle risposte TMDB, ricevono solo oggetti "media" normalizzati.
// -----------------------------------------------------------------------------

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// True solo se l'utente ha davvero configurato una key nel .env.
export const isTmdbConfigured =
  !!API_KEY && API_KEY !== 'INCOLLA_QUI_LA_TUA_API_KEY_TMDB';

/**
 * Costruisce l'URL completo di un poster a partire dal path relativo TMDB.
 * @param {string|null} path - es. "/abc123.jpg"
 * @param {string} size - w92 | w154 | w185 | w342 | w500 | original
 * @returns {string|null}
 */
export function posterUrl(path, size = 'w342') {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

// Estrae l'anno (YYYY) da una data TMDB, con fallback sicuro.
function extractYear(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const year = dateStr.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

/**
 * Normalizza un risultato grezzo del /search/multi di TMDB nel formato interno
 * usato in tutta l'app. Ritorna null per tipi non gestiti (es. "person").
 */
function normalizeResult(raw) {
  const mediaType = raw.media_type;
  if (mediaType !== 'movie' && mediaType !== 'tv') return null;

  const title = mediaType === 'movie' ? raw.title : raw.name;
  const date = mediaType === 'movie' ? raw.release_date : raw.first_air_date;

  return {
    id: raw.id,
    mediaType, // 'movie' | 'tv'
    title: title || 'Titolo sconosciuto',
    year: extractYear(date),
    posterPath: raw.poster_path || null,
    overview: raw.overview || '',
    voteAverage: typeof raw.vote_average === 'number' ? raw.vote_average : null,
  };
}

/**
 * Cerca film e serie TV su TMDB (endpoint /search/multi).
 * @param {string} query
 * @param {object} [opts] - { signal } per abort
 * @returns {Promise<Array>} lista di media normalizzati (solo movie/tv)
 */
export async function searchTitles(query, { signal } = {}) {
  const trimmed = (query || '').trim();
  if (!trimmed) return [];

  if (!isTmdbConfigured) {
    throw new Error(
      'API key TMDB mancante. Copia .env.example in .env e inserisci la tua key.'
    );
  }

  const url =
    `${BASE_URL}/search/multi` +
    `?api_key=${encodeURIComponent(API_KEY)}` +
    `&query=${encodeURIComponent(trimmed)}` +
    `&include_adult=false&language=it-IT&page=1`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('API key TMDB non valida (401). Controlla il file .env.');
    }
    throw new Error(`Errore TMDB (${res.status}). Riprova più tardi.`);
  }

  const data = await res.json();
  return (data.results || [])
    .map(normalizeResult)
    .filter(Boolean)
    // Poster prima: risultati con locandina sono più utili in una lista visiva.
    .sort((a, b) => (b.posterPath ? 1 : 0) - (a.posterPath ? 1 : 0));
}
