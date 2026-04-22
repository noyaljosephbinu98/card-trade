import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type ListRenderItem,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/features/theme';
import { spacing } from '@/features/theme/tokens';

import { type Listing } from '../types';

import { CARD_HEIGHT, ListingCard } from './ListingCard';
import { ListingTileCard } from './ListingTileCard';

// Matches ListingCard.container.marginBottom (theme.spacing.sm).
const CARD_VERTICAL_MARGIN = spacing.sm;

// Matches ListingTileCard body height: paddingTop(sm) + title(minHeight 36) +
// gap(4) + price(lineHeight 24) + gap(4) + overline(lineHeight 14) + paddingBottom(md).
// Keep in sync with the tile's body styles.
const TILE_BODY_HEIGHT = spacing.sm + 36 + 4 + 24 + 4 + 14 + spacing.md;
const TILE_BORDER = 2; // top + bottom borderWidth

export type ListingListLayout = 'list' | 'grid';

type Props = {
  listings: readonly Listing[];
  onPressListingId: (id: string) => void;
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  layout?: ListingListLayout;
};

const keyExtractor = (item: Listing) => item.id;
const itemHeight = CARD_HEIGHT + CARD_VERTICAL_MARGIN;
const getItemLayoutList = (_: ArrayLike<Listing> | null | undefined, index: number) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

export const ListingList = React.memo(function ListingList({
  listings,
  onPressListingId,
  ListEmptyComponent,
  ListHeaderComponent,
  contentContainerStyle,
  refreshing,
  onRefresh,
  layout = 'list',
}: Props) {
  const theme = useTheme();
  const isGrid = layout === 'grid';
  const { width: windowWidth } = useWindowDimensions();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.bg },
        content: {
          paddingVertical: theme.spacing.md,
          // flexGrow lets ListEmptyComponent stretch to center when the data is empty.
          flexGrow: 1,
        },
        gridColumn: {
          paddingHorizontal: theme.spacing.xl,
          gap: theme.spacing.md,
          marginBottom: theme.spacing.md,
        },
      }),
    [theme],
  );

  // Square tile image height === tile width. Derived from the window so rotation
  // or iPad split-view recomputes the row height without re-measuring in layout.
  const gridRowHeight = useMemo(() => {
    const tileWidth = (windowWidth - theme.spacing.xl * 2 - theme.spacing.md) / 2;
    return tileWidth + TILE_BODY_HEIGHT + TILE_BORDER + theme.spacing.md;
  }, [windowWidth, theme.spacing.xl, theme.spacing.md]);

  const getItemLayoutGrid = useCallback(
    (_: ArrayLike<Listing> | null | undefined, index: number) => ({
      length: gridRowHeight,
      offset: gridRowHeight * Math.floor(index / 2),
      index,
    }),
    [gridRowHeight],
  );

  const renderItemList = useCallback<ListRenderItem<Listing>>(
    ({ item }) => <ListingCard listing={item} onPressId={onPressListingId} />,
    [onPressListingId],
  );

  const renderItemGrid = useCallback<ListRenderItem<Listing>>(
    ({ item }) => <ListingTileCard listing={item} onPressId={onPressListingId} />,
    [onPressListingId],
  );

  const mergedContentContainerStyle = useMemo(
    () => (contentContainerStyle ? [styles.content, contentContainerStyle] : styles.content),
    [styles.content, contentContainerStyle],
  );

  return (
    <View style={styles.container}>
      {isGrid ? (
        <FlatList
          key="grid"
          data={listings as Listing[]}
          keyExtractor={keyExtractor}
          renderItem={renderItemGrid}
          numColumns={2}
          columnWrapperStyle={styles.gridColumn}
          getItemLayout={getItemLayoutGrid}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={mergedContentContainerStyle}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <FlatList
          key="list"
          data={listings as Listing[]}
          keyExtractor={keyExtractor}
          renderItem={renderItemList}
          getItemLayout={getItemLayoutList}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={mergedContentContainerStyle}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
});
