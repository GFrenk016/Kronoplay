// -----------------------------------------------------------------------------
// Repository della libreria — persistenza locale via AsyncStorage.
// -----------------------------------------------------------------------------
// Questo modulo è l'UNICO punto dell'app che sa DOVE sono salvati i dati.
// Espone un'interfaccia asincrona (getAll/save/remove/clear) volutamente generica:
// domani, per passare a Supabase, basterà creare un file "supabaseLibraryRepository.js"
// con gli stessi metodi e cambiare l'import nel LibraryContext — senza toccare la UI.
//
// Forma di un elemento della libreria:
// {
//   key: string,          // identità univoca: `${mediaType}-${id}`
//   id: number,           // id TMDB
//   mediaType: 'movie'|'tv',
//   title: string,
//   year: string|null,
//   posterPath: string|null,
//   status: 'watched'|'watchlist',
//   rating: number|null,  // 1..5, solo per gli "watched"
//   addedAt: string,      // ISO timestamp
// }
// -----------------------------------------------------------------------------

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'kronoplay:library:v1';

// Costruisce la chiave univoca di un media.
export function makeKey(mediaType, id) {
  return `${mediaType}-${id}`;
}

/**
 * Ritorna l'intera libreria come array. Mai lancia: in caso di dati corrotti
 * o assenti ritorna [] così la UI resta sempre in uno stato valido.
 * @returns {Promise<Array>}
 */
export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[libraryRepository] getAll fallito, ritorno lista vuota:', err);
    return [];
  }
}

// Scrive l'intero array (helper interno).
async function writeAll(items) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Inserisce o aggiorna un elemento (upsert per `key`).
 * @param {object} item
 * @returns {Promise<Array>} la libreria aggiornata
 */
export async function save(item) {
  const items = await getAll();
  const idx = items.findIndex((it) => it.key === item.key);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...item };
  } else {
    items.push(item);
  }
  await writeAll(items);
  return items;
}

/**
 * Rimuove un elemento per chiave.
 * @param {string} key
 * @returns {Promise<Array>} la libreria aggiornata
 */
export async function remove(key) {
  const items = await getAll();
  const next = items.filter((it) => it.key !== key);
  await writeAll(next);
  return next;
}

/**
 * Svuota completamente la libreria (utile per debug/reset).
 * @returns {Promise<Array>}
 */
export async function clear() {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return [];
}
