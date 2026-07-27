// -----------------------------------------------------------------------------
// Schermata "Statistiche" — contatore titoli visti + qualche metrica base.
// Volutamente minimale per il prototipo; qui crescerà (ore totali, generi, ecc.).
// -----------------------------------------------------------------------------

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RatingStars from '../components/RatingStars';
import { colors, radius, spacing, typography } from '../constants/theme';
import { useLibrary } from '../hooks/useLibrary';

function StatCard({ value, label, big = false }) {
  return (
    <View style={[styles.card, big && styles.cardBig]}>
      <Text style={[styles.cardValue, big && styles.cardValueBig]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const { stats } = useLibrary();
  const avg = stats.avgRating;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Statistiche</Text>
        <Text style={styles.subheading}>Il tuo storico in numeri</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Metrica principale: totale titoli visti. */}
        <StatCard big value={stats.totalWatched} label="Titoli visti in totale" />

        <View style={styles.grid}>
          <StatCard value={stats.movies} label="Film" />
          <StatCard value={stats.series} label="Serie TV" />
        </View>

        <View style={styles.grid}>
          <StatCard value={stats.totalWatchlist} label="In watchlist" />
          <StatCard
            value={avg > 0 ? avg.toFixed(1) : '—'}
            label="Voto medio"
          />
        </View>

        {avg > 0 && (
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Media voti</Text>
            <RatingStars value={Math.round(avg)} size={22} />
          </View>
        )}
      </ScrollView>
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
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardBig: {
    paddingVertical: spacing.xxl,
  },
  cardValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  cardValueBig: {
    fontSize: 56,
    color: colors.primary,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  avgLabel: {
    ...typography.title,
    color: colors.text,
  },
});
