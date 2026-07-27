// -----------------------------------------------------------------------------
// Schermata "I miei visti" — lista dei titoli segnati come visti, con voto,
// ordinati per data di aggiunta (più recenti in alto). Voto modificabile inline.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '../components/EmptyState';
import MediaRow from '../components/MediaRow';
import PillButton from '../components/PillButton';
import RatingStars from '../components/RatingStars';
import { colors, spacing, typography } from '../constants/theme';
import { useLibrary } from '../hooks/useLibrary';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function WatchedScreen() {
  const { watched, updateRating, removeItem } = useLibrary();
  const [editingKey, setEditingKey] = useState(null);

  const confirmRemove = (item) => {
    Alert.alert('Rimuovere dai visti?', `“${item.title}” verrà rimosso.`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Rimuovi', style: 'destructive', onPress: () => removeItem(item.key) },
    ]);
  };

  const renderItem = ({ item }) => {
    const isEditing = editingKey === item.key;
    return (
      <MediaRow
        title={item.title}
        year={item.year}
        mediaType={item.mediaType}
        posterPath={item.posterPath}
      >
        <View style={styles.ratingRow}>
          <RatingStars
            value={item.rating || 0}
            size={20}
            onRate={
              isEditing
                ? (val) => {
                    updateRating(item.key, val);
                    setEditingKey(null);
                  }
                : undefined
            }
          />
          <Text style={styles.date}>{formatDate(item.addedAt)}</Text>
        </View>

        <View style={styles.actionsRow}>
          <PillButton
            label={isEditing ? 'Fine' : 'Modifica voto'}
            onPress={() => setEditingKey(isEditing ? null : item.key)}
          />
          <PillButton label="Rimuovi" variant="danger" onPress={() => confirmRemove(item)} />
        </View>
      </MediaRow>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>I miei visti</Text>
        <Text style={styles.subheading}>
          {watched.length} {watched.length === 1 ? 'titolo' : 'titoli'} · ordinati per data
        </Text>
      </View>

      {watched.length === 0 ? (
        <EmptyState
          icon="🍿"
          title="Ancora nessun titolo visto"
          subtitle="Cerca un film o una serie e segnalo come visto con un voto."
        />
      ) : (
        <FlatList
          data={watched}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    ...typography.caption,
    color: colors.textFaint,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
