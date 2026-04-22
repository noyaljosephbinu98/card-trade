import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { HomeStackParamList } from '@/app/types';
import { EmptyState } from '@/components';
import { SavedHeaderButton } from '@/features/saved/components/SavedHeaderButton';
import { useTheme } from '@/features/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { FilterSheet } from '../components/FilterSheet';
import { ListingTileSkeletonGrid } from '../components/ListingCardSkeleton';
import { ListingList } from '../components/ListingList';
import { SearchBar } from '../components/SearchBar';
import { countActiveFilters, routeParamsToFilters } from '../deepLinkFilters';
import { applyFilters, uniqueCategories, uniqueGradingCompanies } from '../filter';
import { useFiltersStore } from '../filtersStore';
import { useListingsQuery } from '../queries';
import { DEFAULT_FILTERS, type Filters } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useListingsQuery();

  const filters = useFiltersStore((s) => s.filters);
  const replaceFilters = useFiltersStore((s) => s.replaceFilters);
  const setFilters = useFiltersStore((s) => s.setFilters);

  const [localQuery, setLocalQuery] = useState<string>(filters.q);
  const debouncedQuery = useDebouncedValue(localQuery, 250);

  const [sheetVisible, setSheetVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SavedHeaderButton />,
      title: 'Marketplace',
    });
  }, [navigation]);

  useEffect(() => {
    if (debouncedQuery !== filters.q) {
      setFilters({ q: debouncedQuery });
    }
  }, [debouncedQuery, filters.q, setFilters]);

  useFocusEffect(
    useCallback(() => {
      if (route.params && Object.keys(route.params).length > 0) {
        const next = routeParamsToFilters(route.params);
        replaceFilters(next);
        setLocalQuery(next.q);
        navigation.setParams({
          q: undefined,
          category: undefined,
          kind: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          gradingCompany: undefined,
          sort: undefined,
        });
      }
    }, [route.params, replaceFilters, navigation]),
  );

  const categories = useMemo(() => uniqueCategories(data ?? []), [data]);
  const gradingCompanies = useMemo(() => uniqueGradingCompanies(data ?? []), [data]);

  const filtered = useMemo(() => applyFilters(data ?? [], filters), [data, filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  const handlePressListing = useCallback(
    (id: string) => navigation.navigate('ListingDetail', { id }),
    [navigation],
  );

  const openFilters = useCallback(() => setSheetVisible(true), []);
  const closeFilters = useCallback(() => setSheetVisible(false), []);
  const applyFiltersFromSheet = useCallback(
    (next: Filters) => {
      replaceFilters(next);
      setLocalQuery(next.q);
      setSheetVisible(false);
    },
    [replaceFilters],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.colors.bg },
        countBar: {
          paddingHorizontal: theme.spacing.xl,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
        countText: {
          ...theme.typography.overline,
          color: theme.colors.textTertiary,
        },
      }),
    [theme],
  );

  const header = useMemo(
    () => (
      <>
        <SearchBar
          value={localQuery}
          onChangeText={setLocalQuery}
          onOpenFilters={openFilters}
          activeFilterCount={activeFilterCount}
        />
        {!isLoading && !isError ? (
          <View style={styles.countBar}>
            <Text style={styles.countText}>
              {filtered.length} {filtered.length === 1 ? 'LISTING' : 'LISTINGS'}
            </Text>
          </View>
        ) : null}
      </>
    ),
    [localQuery, openFilters, activeFilterCount, filtered.length, styles, isLoading, isError],
  );

  const empty = useMemo(() => {
    if (isLoading) return <ListingTileSkeletonGrid count={6} />;
    if (isError)
      return (
        <EmptyState
          title="Couldn't load the marketplace"
          subtitle="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => refetch()}
          tone="danger"
        />
      );
    return (
      <EmptyState
        title="Nothing matches yet"
        subtitle="Try widening your search or clearing active filters."
        actionLabel={activeFilterCount > 0 ? 'Clear filters' : undefined}
        onAction={
          activeFilterCount > 0
            ? () => {
                replaceFilters(DEFAULT_FILTERS);
                setLocalQuery('');
              }
            : undefined
        }
      />
    );
  }, [isLoading, isError, refetch, activeFilterCount, replaceFilters]);

  return (
    <View style={styles.root}>
      <ListingList
        listings={filtered}
        onPressListingId={handlePressListing}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshing={isRefetching}
        onRefresh={refetch}
        layout="grid"
      />
      <FilterSheet
        visible={sheetVisible}
        filters={filters}
        categories={categories}
        gradingCompanies={gradingCompanies}
        onApply={applyFiltersFromSheet}
        onClose={closeFilters}
      />
    </View>
  );
}
