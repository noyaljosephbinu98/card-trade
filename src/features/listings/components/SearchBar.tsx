import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components';
import { useTheme } from '@/features/theme';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  placeholder?: string;
};

export const SearchBar = React.memo(function SearchBar({
  value,
  onChangeText,
  onOpenFilters,
  activeFilterCount,
  placeholder = 'Search listings…',
}: Props) {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.sm,
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.bg,
        },
        inputWrap: {
          flex: 1,
          height: 48,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
        },
        input: {
          flex: 1,
          color: theme.colors.text,
          ...theme.typography.body,
          paddingVertical: 0,
        },
        clear: {
          ...theme.typography.caption,
          color: theme.colors.muted,
          fontWeight: '600',
          paddingHorizontal: theme.spacing.xs,
        },
        filterButton: {
          height: 48,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacing.sm,
        },
        filterButtonActive: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        filterLabel: { ...theme.typography.bodyMedium, color: theme.colors.text },
        filterLabelActive: { color: theme.colors.onPrimary },
        badge: {
          minWidth: 18,
          height: 18,
          paddingHorizontal: 6,
          borderRadius: 9,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        badgeActive: { backgroundColor: theme.colors.onPrimary },
        badgeText: { color: theme.colors.onPrimary, fontSize: 11, fontWeight: '700' },
        badgeTextActive: { color: theme.colors.primary },
      }),
    [theme],
  );

  const handleClear = useCallback(() => onChangeText(''), [onChangeText]);
  const active = activeFilterCount > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.inputWrap}>
        <Icon name="search-outline" size={18} color={theme.colors.textTertiary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
          selectionColor={theme.colors.primary}
          style={styles.input}
          accessibilityLabel="Search listings"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        onPress={onOpenFilters}
        style={[styles.filterButton, active && styles.filterButtonActive]}
        accessibilityRole="button"
        accessibilityLabel={active ? `Open filters, ${activeFilterCount} active` : 'Open filters'}
      >
        <Icon
          name="options-outline"
          size={18}
          color={active ? theme.colors.onPrimary : theme.colors.text}
        />
        <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>Filters</Text>
        {active ? (
          <View style={[styles.badge, styles.badgeActive]}>
            <Text style={[styles.badgeText, styles.badgeTextActive]}>{activeFilterCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
});
