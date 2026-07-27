// Poster di un titolo con fallback grafico quando TMDB non ha la locandina.

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../constants/theme';
import { posterUrl } from '../services/api/tmdb';

export default function Poster({ path, width = 64, height = 96 }) {
  const uri = posterUrl(path, 'w185');
  const dims = { width, height, borderRadius: radius.sm };

  if (!uri) {
    return (
      <View style={[styles.fallback, dims]}>
        <Text style={styles.fallbackIcon}>🎬</Text>
      </View>
    );
  }

  return <Image source={{ uri }} style={dims} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    fontSize: 22,
  },
});
