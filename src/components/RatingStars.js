// Stelle di voto 1..5. Modalità sola-lettura (display) o interattiva (onRate).

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

export default function RatingStars({ value = 0, onRate, size = 18 }) {
  const interactive = typeof onRate === 'function';

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const glyph = (
          <Text style={[styles.star, { fontSize: size }, filled && styles.filled]}>
            {filled ? '★' : '☆'}
          </Text>
        );

        if (!interactive) return <View key={star}>{glyph}</View>;

        return (
          <Pressable
            key={star}
            onPress={() => onRate(star)}
            hitSlop={6}
            style={styles.pressable}
            accessibilityRole="button"
            accessibilityLabel={`Assegna ${star} ${star === 1 ? 'stella' : 'stelle'}`}
          >
            {glyph}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressable: {
    paddingHorizontal: 2,
  },
  star: {
    color: colors.textFaint,
    marginRight: 2,
  },
  filled: {
    color: colors.star,
  },
});
