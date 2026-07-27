// Piccolo badge che distingue a colpo d'occhio Film da Serie TV.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

export default function MediaTypeBadge({ mediaType }) {
  const label = mediaType === 'movie' ? 'Film' : 'Serie TV';
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
