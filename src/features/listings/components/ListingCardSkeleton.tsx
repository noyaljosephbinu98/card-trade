import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components';
import { useTheme, type Theme } from '@/features/theme';

import { CARD_HEIGHT } from './ListingCard';

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
    image: {
      width: CARD_HEIGHT - t.spacing.md * 2,
      height: CARD_HEIGHT - t.spacing.md * 2,
    },
    body: {
      flex: 1,
      marginLeft: t.spacing.md,
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    topStack: { gap: t.spacing.sm },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    // Grid variants — mirror ListingTileCard's layout so the loading state
    // doesn't flash a different silhouette before real tiles land.
    gridWrap: {
      paddingHorizontal: t.spacing.xl,
      paddingTop: t.spacing.md,
    },
    gridRow: {
      flexDirection: 'row',
      gap: t.spacing.md,
      marginBottom: t.spacing.md,
    },
    tile: {
      flex: 1,
      backgroundColor: t.colors.card,
      borderRadius: t.radius.lg,
      borderWidth: 1,
      borderColor: t.colors.border,
      overflow: 'hidden',
    },
    tileImage: {
      width: '100%',
      aspectRatio: 1,
    },
    tileBody: {
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
      paddingBottom: t.spacing.md,
      gap: 6,
    },
  });

export const ListingCardSkeleton = React.memo(function ListingCardSkeleton() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container} accessible accessibilityLabel="Loading listing" accessibilityRole="progressbar">
      <Skeleton style={styles.image} radius={theme.radius.md} tone="elevated" />
      <View style={styles.body}>
        <View style={styles.topStack}>
          <Skeleton width="85%" height={14} />
          <Skeleton width="60%" height={12} />
        </View>
        <View style={styles.bottomRow}>
          <Skeleton width={90} height={18} radius={theme.radius.sm} />
          <Skeleton width={32} height={32} radius={theme.radius.pill} tone="elevated" />
        </View>
      </View>
    </View>
  );
});

type ListProps = { count?: number };

export const ListingCardSkeletonList = React.memo(function ListingCardSkeletonList({
  count = 6,
}: ListProps) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading listings">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </View>
  );
});

const ListingTileSkeleton = React.memo(function ListingTileSkeleton() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.tile}>
      <Skeleton style={styles.tileImage} radius={0} tone="elevated" />
      <View style={styles.tileBody}>
        <Skeleton width="90%" height={14} />
        <Skeleton width="55%" height={14} />
        <Skeleton width={70} height={16} radius={theme.radius.sm} />
        <Skeleton width={90} height={10} />
      </View>
    </View>
  );
});

/**
 * 2-column grid of tile-shaped skeletons. Pairs with `ListingList layout="grid"`
 * so the loading silhouette matches what lands afterward.
 */
export const ListingTileSkeletonGrid = React.memo(function ListingTileSkeletonGrid({
  count = 6,
}: ListProps) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const rows = Math.ceil(count / 2);

  return (
    <View
      style={styles.gridWrap}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading listings">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.gridRow}>
          <ListingTileSkeleton />
          {rowIdx * 2 + 1 < count ? (
            <ListingTileSkeleton />
          ) : (
            <View style={styles.tile} />
          )}
        </View>
      ))}
    </View>
  );
});

