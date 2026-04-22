import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Chip } from '@/components';
import { useTheme } from '@/features/theme';
import { formatCategoryLabel } from '@/utils/formatters';

import { DEFAULT_FILTERS, type Filters, type FilterKind, type SortKey } from '../types';

type Props = {
  visible: boolean;
  filters: Filters;
  categories: readonly string[];
  gradingCompanies: readonly string[];
  onApply: (next: Filters) => void;
  onClose: () => void;
};

const KIND_OPTIONS: readonly { id: FilterKind; label: string }[] = [
  { id: 'any', label: 'Any' },
  { id: 'FIXED_PRICE', label: 'Buy now' },
  { id: 'AUCTION', label: 'Auction' },
];

const SORT_OPTIONS: readonly { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'altValue-desc', label: 'Alt value ↓' },
];

export function FilterSheet({
  visible,
  filters,
  categories,
  gradingCompanies,
  onApply,
  onClose,
}: Props) {
  const theme = useTheme();
  const [draft, setDraft] = useState<Filters>(filters);

  React.useEffect(() => {
    if (visible) setDraft(filters);
  }, [filters, visible]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'flex-end' },
        sheet: {
          backgroundColor: theme.colors.bg,
          borderTopLeftRadius: theme.radius.lg,
          borderTopRightRadius: theme.radius.lg,
          maxHeight: '90%',
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        handle: {
          alignSelf: 'center',
          width: 44,
          height: 4,
          borderRadius: 2,
          backgroundColor: theme.colors.border,
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.xs,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
        },
        title: {
          ...theme.typography.display,
          fontSize: 22,
          lineHeight: 26,
          color: theme.colors.text,
        },
        close: { ...theme.typography.bodyMedium, color: theme.colors.primary },
        scroll: { paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.xl },
        section: { marginBottom: theme.spacing.xl },
        label: {
          ...theme.typography.overline,
          color: theme.colors.textTertiary,
          marginBottom: theme.spacing.sm,
        },
        row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
        priceRow: { flexDirection: 'row', gap: theme.spacing.sm },
        priceInput: {
          flex: 1,
          height: 48,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          color: theme.colors.text,
          ...theme.typography.body,
        },
        footer: {
          flexDirection: 'row',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        footerButton: { flex: 1 },
      }),
    [theme],
  );

  const setDraftField = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const apply = useCallback(() => {
    onApply(draft);
  }, [draft, onApply]);

  // Reset = clear every filter (keep the search query) AND close the sheet in one tap.
  // Previously this only cleared the draft, leaving the user to also tap Apply, which
  // felt broken because the label suggests a terminal action.
  const reset = useCallback(() => {
    const next = { ...DEFAULT_FILTERS, q: draft.q };
    setDraft(next);
    onApply(next);
  }, [draft.q, onApply]);

  const priceToText = (n: number | null) => (n == null ? '' : String(n));
  const textToPrice = (t: string): number | null => {
    const v = parseFloat(t);
    return Number.isFinite(v) && v >= 0 ? v : null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={() => undefined}>
          <SafeAreaView style={styles.sheet} edges={['bottom']}>
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.title}>Filters</Text>
              <Pressable onPress={reset} accessibilityRole="button">
                <Text style={styles.close}>Reset</Text>
              </Pressable>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView
                style={{ maxHeight: 560 }}
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled">
                <View style={styles.section}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.row}>
                    <Chip
                      label="All"
                      active={draft.category == null}
                      onPress={() => setDraftField('category', null)}
                    />
                    {categories.map((c) => (
                      <Chip
                        key={c}
                        label={formatCategoryLabel(c)}
                        active={draft.category === c}
                        onPress={() => setDraftField('category', c)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.row}>
                    {KIND_OPTIONS.map((opt) => (
                      <Chip
                        key={opt.id}
                        label={opt.label}
                        active={draft.kind === opt.id}
                        onPress={() => setDraftField('kind', opt.id)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Price range (USD)</Text>
                  <View style={styles.priceRow}>
                    <TextInput
                      value={priceToText(draft.minPrice)}
                      onChangeText={(t) => setDraftField('minPrice', textToPrice(t))}
                      keyboardType="numeric"
                      placeholder="Min"
                      placeholderTextColor={theme.colors.textTertiary}
                      selectionColor={theme.colors.primary}
                      style={styles.priceInput}
                      accessibilityLabel="Minimum price"
                    />
                    <TextInput
                      value={priceToText(draft.maxPrice)}
                      onChangeText={(t) => setDraftField('maxPrice', textToPrice(t))}
                      keyboardType="numeric"
                      placeholder="Max"
                      placeholderTextColor={theme.colors.textTertiary}
                      selectionColor={theme.colors.primary}
                      style={styles.priceInput}
                      accessibilityLabel="Maximum price"
                    />
                  </View>
                </View>

                {gradingCompanies.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>Grading company</Text>
                    <View style={styles.row}>
                      <Chip
                        label="Any"
                        active={draft.gradingCompany == null}
                        onPress={() => setDraftField('gradingCompany', null)}
                      />
                      {gradingCompanies.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          active={draft.gradingCompany === c}
                          onPress={() => setDraftField('gradingCompany', c)}
                        />
                      ))}
                    </View>
                  </View>
                ) : null}

                <View style={styles.section}>
                  <Text style={styles.label}>Sort by</Text>
                  <View style={styles.row}>
                    {SORT_OPTIONS.map((opt) => (
                      <Chip
                        key={opt.id}
                        label={opt.label}
                        active={draft.sort === opt.id}
                        onPress={() => setDraftField('sort', opt.id)}
                      />
                    ))}
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.footer}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onClose}
                style={styles.footerButton}
              />
              <Button title="Apply" onPress={apply} style={styles.footerButton} />
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
