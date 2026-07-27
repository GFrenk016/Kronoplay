// Modale per assegnare un voto quando si segna un titolo come "visto".

import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';
import RatingStars from './RatingStars';

export default function RatingModal({ visible, media, onConfirm, onClose }) {
  const [rating, setRating] = useState(0);

  // Reset del voto ogni volta che si apre la modale su un nuovo titolo.
  useEffect(() => {
    if (visible) setRating(0);
  }, [visible, media]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop propagation: tap dentro la card non chiude la modale. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.eyebrow}>Che voto gli dai?</Text>
          <Text style={styles.title} numberOfLines={2}>
            {media?.title}
          </Text>

          <View style={styles.starsWrap}>
            <RatingStars value={rating} onRate={setRating} size={34} />
          </View>

          <Pressable
            style={[styles.confirmBtn, rating === 0 && styles.confirmBtnDisabled]}
            disabled={rating === 0}
            onPress={() => onConfirm(rating)}
          >
            <Text style={styles.confirmText}>
              {rating === 0 ? 'Scegli un voto' : `Segna come visto (${rating}★)`}
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Annulla</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  starsWrap: {
    marginBottom: spacing.xl,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.6,
  },
  confirmText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
