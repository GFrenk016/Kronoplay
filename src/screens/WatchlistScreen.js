// -----------------------------------------------------------------------------
// Schermata "Watchlist" — titoli salvati da guardare (senza voto).
// Da qui si può spostare un titolo tra i "visti" (assegnando un voto) o rimuoverlo.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import MediaRow from '../components/MediaRow';
import PillButton from '../components/PillButton';
import RatingModal from '../components/RatingModal';
import { colors, spacing, typography } from '../constants/theme';
import { useLibrary } from '../hooks/useLibrary';

export default function WatchlistScreen() {
  const { watchlist, markWatched, removeItem } = useLibrary();
  const [ratingTarget, setRatingTarget] = useState(null);

  const confirmRemove = (item) => {
    Alert.alert('Rimuovere dalla watchlist?', `“${item.title}” verrà rimosso.`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Rimuovi', style: 'destructive', onPress: () => removeItem(item.key) },
    ]);
  };

  const handleConfirmRating = async (rating) => {
    if (ratingTarget) {
      // markWatched fa upsert sulla stessa key: il titolo passa da watchlist a visti.
      await markWatched(ratingTarget, rating);
    }
    setRatingTarget(null);
  };

  const renderItem = ({ item }) => (
    <MediaRow
      title={item.title}
      year={item.year}
      mediaType={item.mediaType}
      posterPath={item.posterPath}
    >
      <View style={styles.actionsRow}>
        <PillButton
          label="✓ Visto"
          variant="primary"
          onPress={() => setRatingTarget(item)}
        />
        <PillButton label="Rimuovi" variant="danger" onPress={() => confirmRemove(item)} />
      </View>
    </MediaRow>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Watchlist</Text>
        <Text style={styles.subheading}>
          {watchlist.length} {watchlist.length === 1 ? 'titolo da guardare' : 'titoli da guardare'}
        </Text>
      </View>

      {watchlist.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="Watchlist vuota"
          subtitle="Salva qui i titoli che vuoi guardare più avanti."
        />
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

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
    paddingBottom: spacing.md,
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
