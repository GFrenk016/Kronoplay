// Bottone "pill" compatto usato per le azioni rapide (visto / watchlist / rimuovi).

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

export default function PillButton({
  label,
  onPress,
  variant = 'default', // 'default' | 'primary' | 'danger'
  disabled = false,
}) {
  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
      ? styles.danger
      : styles.default;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.text, variant === 'primary' && styles.textPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  default: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: 'transparent',
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
});
