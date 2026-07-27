// Stato vuoto riutilizzabile per liste senza contenuti.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

export default function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
