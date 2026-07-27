// Riga presentazionale di un titolo: poster + meta + slot azioni a destra/sotto.
// Riutilizzata da Ricerca, Visti e Watchlist per garantire UI coerente.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';
import MediaTypeBadge from './MediaTypeBadge';
import Poster from './Poster';

export default function MediaRow({
  title,
  year,
  mediaType,
  posterPath,
  children, // slot azioni (bottoni, stelle, ecc.)
}) {
  return (
    <View style={styles.row}>
      <Poster path={posterPath} width={60} height={90} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <MediaTypeBadge mediaType={mediaType} />
          {!!year && <Text style={styles.year}>{year}</Text>}
        </View>

        {!!children && <View style={styles.actions}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'flex-start',
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  year: {
    ...typography.caption,
    color: colors.textMuted,
  },
  actions: {
    marginTop: spacing.md,
  },
});
