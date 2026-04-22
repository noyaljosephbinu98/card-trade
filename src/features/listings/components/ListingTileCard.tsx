import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components';
import { useIsSaved, useSavedStore } from '@/features/saved/store';
import { useTheme, type Theme } from '@/features/theme';
import { formatCategoryLabel, formatCurrency, formatRelativeFromNow } from '@/utils/formatters';

import { type Listing, listingPrice } from '../types';

type Props = {
  listing: Listing;
  onPressId: (id: string) => void;
};

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.card,
      borderRadius: t.radius.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      overflow: 'hidden',
    },
    pressed: { opacity: 0.8 },
    imageWrap: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: t.colors.cardElevated,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePlaceholderText: {
      ...t.typography.caption,
      color: t.colors.textTertiary,
    },
    gradeBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: t.radius.sm,
    },
    gradeBadgeText: {
      color: '#0B0D10',
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    timerBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: t.colors.danger,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: t.radius.pill,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    timerBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    heart: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      width: 30,
      height: 30,
      borderRadius: t.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    body: {
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
      paddingBottom: t.spacing.md,
      gap: 4,
    },
    title: {
      ...t.typography.bodyMedium,
      color: t.colors.text,
      fontSize: 14,
      lineHeight: 18,
      minHeight: 36,
    },
    price: {
      ...t.typography.price,
      color: t.colors.primary,
      fontSize: 16,
    },
    overline: {
      ...t.typography.overline,
      color: t.colors.textTertiary,
      fontSize: 10,
      letterSpacing: 0.8,
    },
  });

export const ListingTileCard = React.memo(
  function ListingTileCard({ listing, onPressId }: Props) {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const isSaved = useIsSaved(listing.id);
    const toggleSaved = useSavedStore(s => s.toggle);

    const handlePress = useCallback(() => onPressId(listing.id), [listing.id, onPressId]);
    const handleToggleSave = useCallback(() => toggleSaved(listing.id), [toggleSaved, listing.id]);

    const price = useMemo(() => listingPrice(listing), [listing]);
    const priceLabel = useMemo(() => formatCurrency(price), [price]);

    const gradeLabel = useMemo(() => {
      if (!listing.gradingCompany || !listing.grade) return null;
      return `${listing.gradingCompany} ${listing.grade}`;
    }, [listing.gradingCompany, listing.grade]);

    const timerLabel = useMemo(() => {
      if (listing.kind !== 'AUCTION') return null;
      return formatRelativeFromNow(listing.expiresAtEpoch);
    }, [listing]);

    const overlineLabel = useMemo(() => {
      const badge = listing.badges?.[0];
      if (badge) return badge.toUpperCase();
      return formatCategoryLabel(listing.category).toUpperCase();
    }, [listing.badges, listing.category]);

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
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.imageWrap}>
          {listing.imageUrl ? (
            <Image source={{ uri: listing.imageUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>No image</Text>
            </View>
          )}

          {gradeLabel ? (
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeBadgeText}>{gradeLabel}</Text>
            </View>
          ) : null}

          {timerLabel ? (
            <View style={styles.timerBadge}>
              <Icon name="time-outline" size={10} color="#FFFFFF" />
              <Text style={styles.timerBadgeText}>{timerLabel}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleToggleSave}
            hitSlop={8}
            style={styles.heart}
            accessibilityRole="button"
            accessibilityLabel={saveLabel}
            accessibilityState={{ selected: isSaved }}
          >
            <Icon
              name={isSaved ? 'heart' : 'heart-outline'}
              size={16}
              color={isSaved ? theme.colors.danger : '#FFFFFF'}
            />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text numberOfLines={2} style={styles.title}>
            {listing.itemName}
          </Text>
          <Text style={styles.price}>{priceLabel}</Text>
          <Text style={styles.overline} numberOfLines={1}>
            {overlineLabel}
          </Text>
        </View>
      </Pressable>
    );
  },
  (a, b) => a.listing === b.listing && a.onPressId === b.onPressId,
);
