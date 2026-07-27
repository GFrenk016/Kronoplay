// -----------------------------------------------------------------------------
// Schermata Ricerca — campo testo, chiamata TMDB, lista risultati con azioni.
// Da ogni risultato si può: segnare come visto (con voto) o salvare in watchlist.
// -----------------------------------------------------------------------------

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import MediaRow from '../components/MediaRow';
import PillButton from '../components/PillButton';
import RatingModal from '../components/RatingModal';
import RatingStars from '../components/RatingStars';
import { colors, spacing, typography } from '../constants/theme';
import { useLibrary } from '../hooks/useLibrary';
import { isTmdbConfigured, searchTitles } from '../services/api/tmdb';

const DEBOUNCE_MS = 450;

export default function SearchScreen() {
  const { byKey, makeKey, markWatched, addToWatchlist } = useLibrary();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const runSearch = useCallback(async (text) => {
    // Annulla l'eventuale richiesta precedente ancora in volo.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError(null);
    try {
      const found = await searchTitles(text, { signal: controller.signal });
      setResults(found);
      setStatus('done');
    } catch (err) {
      if (err.name === 'AbortError') return; // sostituita da una ricerca più recente
      setError(err.message || 'Errore durante la ricerca.');
      setResults([]);
      setStatus('error');
    }
  }, []);

  // Ricerca con debounce a ogni cambio del testo.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(() => runSearch(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  const handleConfirmRating = useCallback(
    async (rating) => {
      if (ratingTarget) await markWatched(ratingTarget, rating);
      setRatingTarget(null);
    },
    [ratingTarget, markWatched]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const key = makeKey(item.mediaType, item.id);
      const inLibrary = byKey[key];
      const isWatched = inLibrary?.status === 'watched';
      const inWatchlist = inLibrary?.status === 'watchlist';

      return (
        <MediaRow
          title={item.title}
          year={item.year}
          mediaType={item.mediaType}
          posterPath={item.posterPath}
        >
          {isWatched ? (
            <View style={styles.watchedRow}>
              <RatingStars value={inLibrary.rating || 0} size={16} />
              <Text style={styles.watchedLabel}>Già visto</Text>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <PillButton
                label="✓ Visto"
                variant="primary"
                onPress={() => {
                  Keyboard.dismiss();
                  setRatingTarget(item);
                }}
              />
              <PillButton
                label={inWatchlist ? '✓ In watchlist' : '+ Watchlist'}
                disabled={inWatchlist}
                onPress={() => addToWatchlist(item)}
              />
            </View>
          )}
        </MediaRow>
      );
    },
    [byKey, makeKey, addToWatchlist]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Cerca</Text>
        <Text style={styles.subheading}>Trova film e serie da tracciare</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Titolo di un film o una serie…"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {!isTmdbConfigured && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠️ API key TMDB non configurata. Copia{' '}
            <Text style={styles.mono}>.env.example</Text> in{' '}
            <Text style={styles.mono}>.env</Text> e inserisci la tua key, poi
            riavvia Expo con <Text style={styles.mono}>-c</Text>.
          </Text>
        </View>
      )}

      <View style={styles.body}>
        {status === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {status === 'error' && (
          <EmptyState icon="⚠️" title="Qualcosa è andato storto" subtitle={error} />
        )}

        {status === 'idle' && (
          <EmptyState
            icon="🎯"
            title="Inizia a cercare"
            subtitle="Scrivi il nome di un titolo per vedere i risultati da TMDB."
          />
        )}

        {status === 'done' && results.length === 0 && (
          <EmptyState
            icon="🤷"
            title="Nessun risultato"
            subtitle={`Nessun titolo trovato per “${query.trim()}”.`}
          />
        )}

        {status === 'done' && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => makeKey(item.mediaType, item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )}
      </View>

      <RatingModal
        visible={!!ratingTarget}
        media={ratingTarget}
        onConfirm={handleConfirmRating}
        onClose={() => setRatingTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
  },
  subheading: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  warning: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  mono: {
    color: colors.text,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    marginTop: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  watchedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  watchedLabel: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
});
