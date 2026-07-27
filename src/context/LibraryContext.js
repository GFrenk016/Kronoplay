// -----------------------------------------------------------------------------
// LibraryContext — stato globale della libreria (visti + watchlist).
// -----------------------------------------------------------------------------
// È il ponte tra il repository (persistenza) e la UI. Le screen non parlano mai
// direttamente con AsyncStorage: usano l'hook useLibrary() che legge da qui.
// Per migrare a Supabase in futuro basta cambiare l'import qui sotto.
// -----------------------------------------------------------------------------

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import * as repository from '../services/storage/libraryRepository';

export const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Caricamento iniziale dalla persistenza.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await repository.getAll();
      if (mounted) {
        setItems(stored);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Costruisce un elemento della libreria da un media TMDB normalizzato.
  const buildItem = useCallback((media, status, rating = null) => {
    return {
      key: repository.makeKey(media.mediaType, media.id),
      id: media.id,
      mediaType: media.mediaType,
      title: media.title,
      year: media.year ?? null,
      posterPath: media.posterPath ?? null,
      status,
      rating,
      addedAt: new Date().toISOString(),
    };
  }, []);

  /** Segna un media come "visto" con un voto 1..5 (upsert). */
  const markWatched = useCallback(
    async (media, rating) => {
      const existing = items.find(
        (it) => it.key === repository.makeKey(media.mediaType, media.id)
      );
      const item = buildItem(media, 'watched', rating);
      // Se era già in libreria, conserviamo la data di aggiunta originale.
      if (existing) item.addedAt = existing.addedAt;
      const next = await repository.save(item);
      setItems([...next]);
    },
    [items, buildItem]
  );

  /** Aggiunge un media alla watchlist (senza voto). No-op se già presente. */
  const addToWatchlist = useCallback(
    async (media) => {
      const key = repository.makeKey(media.mediaType, media.id);
      if (items.some((it) => it.key === key && it.status === 'watchlist')) return;
      const item = buildItem(media, 'watchlist', null);
      const next = await repository.save(item);
      setItems([...next]);
    },
    [items, buildItem]
  );

  /** Aggiorna solo il voto di un elemento già visto. */
  const updateRating = useCallback(async (key, rating) => {
    const next = await repository.save({ key, rating, status: 'watched' });
    setItems([...next]);
  }, []);

  /** Rimuove un elemento dalla libreria. */
  const removeItem = useCallback(async (key) => {
    const next = await repository.remove(key);
    setItems([...next]);
  }, []);

  // Derivati memoizzati: le screen consumano direttamente queste liste.
  const watched = useMemo(
    () =>
      items
        .filter((it) => it.status === 'watched')
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)),
    [items]
  );

  const watchlist = useMemo(
    () =>
      items
        .filter((it) => it.status === 'watchlist')
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)),
    [items]
  );

  const stats = useMemo(() => {
    const rated = watched.filter((it) => typeof it.rating === 'number');
    const avgRating =
      rated.length > 0
        ? rated.reduce((sum, it) => sum + it.rating, 0) / rated.length
        : 0;
    return {
      totalWatched: watched.length,
      totalWatchlist: watchlist.length,
      movies: watched.filter((it) => it.mediaType === 'movie').length,
      series: watched.filter((it) => it.mediaType === 'tv').length,
      avgRating,
    };
  }, [watched, watchlist]);

  // Mappa key -> item per lookup O(1) dalle screen (es. stato di un risultato).
  const byKey = useMemo(() => {
    const map = {};
    for (const it of items) map[it.key] = it;
    return map;
  }, [items]);

  const value = useMemo(
    () => ({
      isLoading,
      items,
      watched,
      watchlist,
      stats,
      byKey,
      makeKey: repository.makeKey,
      markWatched,
      addToWatchlist,
      updateRating,
      removeItem,
    }),
    [
      isLoading,
      items,
      watched,
      watchlist,
      stats,
      byKey,
      markWatched,
      addToWatchlist,
      updateRating,
      removeItem,
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
