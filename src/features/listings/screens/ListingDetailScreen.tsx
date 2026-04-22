import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { HomeStackParamList } from '@/app/types';
import {
  Button,
  Chip,
  ComingSoonOverlay,
  EmptyState,
  Icon,
  PriceTag,
  Skeleton,
} from '@/components';
import { useIsSaved, useSavedStore } from '@/features/saved/store';
import { useTheme, type Theme } from '@/features/theme';
import { formatCategoryLabel, formatRelativeFromNow } from '@/utils/formatters';

import { useListingsQuery } from '../queries';
import { listingPrice, type Listing } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { data, isLoading, isError, refetch } = useListingsQuery();
  const listing = useMemo<Listing | undefined>(
    () => data?.find((l) => l.id === route.params.id),
    [data, route.params.id],
  );

  const isSaved = useIsSaved(route.params.id);
  const toggleSaved = useSavedStore((s) => s.toggle);

  const onToggleSave = useCallback(
    () => toggleSaved(route.params.id),
    [toggleSaved, route.params.id],
  );

  const [comingSoonVisible, setComingSoonVisible] = useState(false);
  const openComingSoon = useCallback(() => setComingSoonVisible(true), []);
  const closeComingSoon = useCallback(() => setComingSoonVisible(false), []);

  const isFixedPrice = listing?.kind === 'FIXED_PRICE';

  useLayoutEffect(() => {
    navigation.setOptions({ title: listing?.itemName ?? 'Listing' });
  }, [navigation, listing?.itemName]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const kindLabel = useMemo(() => {
    if (!listing) return '';
    if (listing.kind !== 'AUCTION') return 'BUY NOW';
    const bidSuffix = listing.bidCount ? ` · ${listing.bidCount} BIDS` : '';
    return `AUCTION · ${formatRelativeFromNow(listing.expiresAtEpoch)} LEFT${bidSuffix}`;
  }, [listing]);

  const metaLine = useMemo(() => {
    if (!listing) return '';
    return [listing.year, listing.brand, formatCategoryLabel(listing.category)]
      .filter(Boolean)
      .join(' · ');
  }, [listing]);

  const price = useMemo(() => (listing ? listingPrice(listing) : 0), [listing]);

  const altValueLabel = useMemo(
    () =>
      listing?.altValue != null
        ? `Alt value · $${listing.altValue.toLocaleString('en-US')}`
        : null,
    [listing?.altValue],
  );

  // When Buy now is the primary CTA we demote Save to secondary, which changes
  // the icon color on the adornment, so memoize with the right foreground.
  const saveIconColor = isFixedPrice
    ? isSaved
      ? theme.colors.danger
      : theme.colors.text
    : isSaved
      ? theme.colors.danger
      : theme.colors.onPrimary;

  const saveRightAdornment = useMemo(
    () => <Icon name={isSaved ? 'heart' : 'heart-outline'} size={18} color={saveIconColor} />,
    [isSaved, saveIconColor],
  );

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Couldn't load this listing"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => refetch()}
          tone="danger"
        />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Listing unavailable"
          subtitle="It may have ended or been removed."
          actionLabel="Back to marketplace"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {listing.imageUrl ? (
        <Image source={{ uri: listing.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>No image</Text>
        </View>
      )}

      <Text style={styles.overline}>{kindLabel}</Text>
      <Text style={styles.title}>{listing.itemName}</Text>
      {listing.subject ? <Text style={styles.subject}>{listing.subject}</Text> : null}
      {metaLine ? <Text style={styles.meta}>{metaLine}</Text> : null}

      <View style={styles.priceWrap}>
        <PriceTag amount={price} size="lg" />
      </View>

      {(listing.gradingCompany && listing.grade) || listing.altValue != null ? (
        <View style={styles.chipsRow}>
          {listing.gradingCompany && listing.grade ? (
            <Chip
              label={`${listing.gradingCompany} · ${listing.grade}`}
              accessibilityLabel={`Graded ${listing.gradingCompany} ${listing.grade}`}
            />
          ) : null}
          {altValueLabel ? (
            <Chip
              label={altValueLabel}
              accessibilityLabel={`Alt value ${listing.altValue}`}
            />
          ) : null}
        </View>
      ) : null}

      <View style={styles.ctaWrap}>
        {isFixedPrice ? (
          <Button
            title="Buy now"
            variant="primary"
            onPress={openComingSoon}
            accessibilityLabel={`Buy now for ${listing.itemName}`}
          />
        ) : null}
        <Button
          title={isSaved ? 'Saved' : 'Save listing'}
          variant={isFixedPrice ? 'secondary' : isSaved ? 'secondary' : 'primary'}
          onPress={onToggleSave}
          rightAdornment={saveRightAdornment}
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save this listing'}
          style={isFixedPrice ? styles.saveSpaced : undefined}
        />
      </View>

      <ComingSoonOverlay visible={comingSoonVisible} onClose={closeComingSoon} />
    </ScrollView>
  );
}

function DetailSkeleton() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading listing">
      <View style={styles.content}>
        <View style={styles.skeletonImage}>
          <Skeleton height={350} radius={theme.radius.lg} tone="elevated" />
        </View>
        <View style={{ gap: theme.spacing.sm }}>
          <Skeleton width={80} height={12} />
          <Skeleton width="85%" height={26} />
          <Skeleton width="55%" height={16} />
        </View>
        <View style={{ marginTop: theme.spacing.lg }}>
          <Skeleton width={160} height={32} />
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <Skeleton width={120} height={28} radius={theme.radius.sm} />
          <Skeleton width={140} height={28} radius={theme.radius.sm} />
        </View>
        <View style={{ marginTop: theme.spacing.xxxl }}>
          <Skeleton height={52} radius={theme.radius.md} tone="elevated" />
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  const padX = theme.spacing.xl;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.bg },
    content: {
      paddingHorizontal: padX,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skeletonImage: {
      width: '100%',
      marginBottom: theme.spacing.xl,
    },
    imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
    imagePlaceholderText: {
      ...theme.typography.caption,
      color: theme.colors.textTertiary,
    },
    overline: {
      ...theme.typography.overline,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.typography.display,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subject: {
      ...theme.typography.body,
      color: theme.colors.muted,
      marginBottom: theme.spacing.xs,
    },
    meta: {
      ...theme.typography.meta,
      color: theme.colors.textTertiary,
    },
    priceWrap: {
      marginTop: theme.spacing.xl,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xl,
    },
    ctaWrap: {
      marginTop: theme.spacing.xxxl,
    },
    saveSpaced: {
      marginTop: theme.spacing.sm,
    },
  });
}
