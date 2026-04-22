import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { HomeStackParamList, MainTabParamList, ProfileStackParamList } from '@/app/types';
import { EmptyState } from '@/components';
import { ListingTileSkeletonGrid } from '@/features/listings/components/ListingCardSkeleton';
import { ListingList } from '@/features/listings/components/ListingList';
import { useListingsQuery } from '@/features/listings/queries';
import { useTheme } from '@/features/theme';
import { useImagePrefetch } from '@/hooks/useImagePrefetch';

import { useSavedStore } from '../store';

type SavedNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Saved'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<HomeStackParamList>
  >
>;

export function SavedScreen() {
  const theme = useTheme();
  const navigation = useNavigation<SavedNavProp>();
  const { data, isLoading, isError, refetch, isRefetching } = useListingsQuery();
  const savedIds = useSavedStore(s => s.ids);
  const hasHydrated = useSavedStore(s => s.hasHydrated);

  const saved = useMemo(() => (data ?? []).filter(l => savedIds.has(l.id)), [data, savedIds]);

  const topSavedImageUrls = useMemo(() => saved.slice(0, 12).map(l => l.imageUrl), [saved]);
  useImagePrefetch(topSavedImageUrls, 12);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.colors.bg },
      }),
    [theme],
  );

  const onPressListingId = useCallback(
    (id: string) => {
      navigation.navigate('HomeTab', { screen: 'ListingDetail', params: { id } });
    },
    [navigation],
  );

  const onBrowse = useCallback(() => {
    navigation.navigate('HomeTab', { screen: 'Home', params: {} });
  }, [navigation]);

  const empty = useMemo(() => {
    if (isLoading || !hasHydrated) return <ListingTileSkeletonGrid count={4} />;
    if (isError)
      return (
        <EmptyState
          title="Couldn't load saved listings"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => refetch()}
          tone="danger"
        />
      );
    return (
      <EmptyState
        title="Nothing saved yet"
        subtitle="Tap the heart on any listing to keep it here."
        actionLabel="Browse marketplace"
        onAction={onBrowse}
      />
    );
  }, [isLoading, isError, hasHydrated, refetch, onBrowse]);

  return (
    <View style={styles.root}>
      <ListingList
        listings={saved}
        onPressListingId={onPressListingId}
        ListEmptyComponent={empty}
        refreshing={isRefetching}
        onRefresh={refetch}
        layout="grid"
      />
    </View>
  );
}
