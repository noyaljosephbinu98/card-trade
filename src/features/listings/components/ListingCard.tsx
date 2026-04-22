import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components';
import { useIsSaved, useSavedStore } from '@/features/saved/store';
import { useTheme, type Theme } from '@/features/theme';
import { formatCategoryLabel, formatCurrency, formatRelativeFromNow } from '@/utils/formatters';

import { type Listing, listingPrice } from '../types';

export const CARD_HEIGHT = 136;
const IMAGE_SIZE = CARD_HEIGHT - 24; // padding * 2

type Props = {
  listing: Listing;
  onPressId: (id: string) => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: CARD_HEIGHT,
      backgroundColor: t.colors.card,
      borderRadius: t.radius.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      padding: t.spacing.md,
      marginHorizontal: t.spacing.xl,
      marginBottom: t.spacing.sm,
      alignItems: 'center',
    },
    pressed: { opacity: 0.75 },
    image: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: t.radius.md,
      backgroundColor: t.colors.cardElevated,
    },
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageText: {
      ...t.typography.caption,
      color: t.colors.textTertiary,
    },
    body: {
      flex: 1,
      marginLeft: t.spacing.lg,
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      paddingVertical: 2,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: t.spacing.sm,
    },
    titleBlock: { flex: 1 },
    title: { ...t.typography.bodyMedium, color: t.colors.text },
    meta: {
      ...t.typography.caption,
      color: t.colors.muted,
      marginTop: 4,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    priceBlock: { flexDirection: 'column' },
    price: {
      ...t.typography.price,
      color: t.colors.primary,
    },
    kindLabel: {
      ...t.typography.caption,
      color: t.colors.muted,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    saveButton: {
      width: 32,
      height: 32,
      borderRadius: t.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.cardElevated,
    },
  });

export const ListingCard = React.memo(
  function ListingCard({ listing, onPressId }: Props) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const isSaved = useIsSaved(listing.id);
    const toggleSaved = useSavedStore((s) => s.toggle);

    const handlePress = useCallback(() => onPressId(listing.id), [listing.id, onPressId]);
    const handleToggleSave = useCallback(() => toggleSaved(listing.id), [toggleSaved, listing.id]);

    const price = useMemo(() => listingPrice(listing), [listing]);

    const kindLabel = useMemo(
      () =>
        listing.kind === 'AUCTION'
          ? `Bid · ${formatRelativeFromNow(listing.expiresAtEpoch)} left`
          : 'Buy now',
      [listing],
    );

    const categoryLabel = useMemo(
      () => formatCategoryLabel(listing.category),
      [listing.category],
    );

    const meta = useMemo(() => {
      const parts: string[] = [];
      if (listing.year != null) parts.push(String(listing.year));
      if (listing.brand) parts.push(listing.brand);
      if (listing.gradingCompany && listing.grade) {
        parts.push(`${listing.gradingCompany} ${listing.grade}`);
      }
      return parts.join(' · ');
    }, [listing.year, listing.brand, listing.gradingCompany, listing.grade]);

    const priceLabel = useMemo(() => formatCurrency(price), [price]);

    const accessibilityLabel = useMemo(
      () => `Open ${listing.itemName}, ${priceLabel}`,
      [listing.itemName, priceLabel],
    );

    const saveLabel = isSaved ? 'Remove from saved' : 'Save listing';

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}>
        {listing.imageUrl ? (
          <Image source={{ uri: listing.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imageText}>No image</Text>
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={2} style={styles.title}>
                {listing.itemName}
              </Text>
              {meta ? (
                <Text numberOfLines={1} style={styles.meta}>
                  {meta} · {categoryLabel}
                </Text>
              ) : (
                <Text style={styles.meta}>{categoryLabel}</Text>
              )}
            </View>
            <Pressable
              onPress={handleToggleSave}
              hitSlop={8}
              style={styles.saveButton}
              accessibilityRole="button"
              accessibilityLabel={saveLabel}
              accessibilityState={{ selected: isSaved }}>
              <Icon
                name={isSaved ? 'heart' : 'heart-outline'}
                size={18}
                color={isSaved ? theme.colors.danger : theme.colors.muted}
              />
            </Pressable>
          </View>
          <View style={styles.footer}>
            <View style={styles.priceBlock}>
              <Text style={styles.price}>{priceLabel}</Text>
              <Text style={styles.kindLabel}>{kindLabel}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  },
  (a, b) => a.listing === b.listing && a.onPressId === b.onPressId,
);
