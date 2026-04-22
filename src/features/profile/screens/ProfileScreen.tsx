import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HomeStackParamList, MainTabParamList, ProfileStackParamList } from '@/app/types';
import { Button, Icon, Skeleton } from '@/components';
import { useAuthStore, useCurrentUser } from '@/features/auth';
import { useSavedCount } from '@/features/saved/store';
import {
  AppearancePicker,
  ThemeToggleButton,
  useTheme,
  type Theme,
} from '@/features/theme';

type ProfileNav = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList>,
    NativeStackNavigationProp<HomeStackParamList>
  >
>;

export function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<ProfileNav>();
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const savedCount = useSavedCount();
  const [loggingOut, setLoggingOut] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const goEdit = useCallback(() => navigation.navigate('EditProfile'), [navigation]);
  const goSaved = useCallback(() => navigation.navigate('Saved'), [navigation]);

  const onLogout = useCallback(() => {
    Alert.alert('Log out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoggingOut(true);
            await Promise.resolve(logout());
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  }, [logout]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <ThemeToggleButton />
        </View>
        <View style={styles.content}>
          <ProfileHeaderSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  const initial = (user.displayName ?? user.email ?? '?').charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <ThemeToggleButton />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user.displayName ?? 'Collector'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.rowGroup}>
          <Pressable
            style={({ pressed }) => [styles.row, styles.rowTop, pressed && styles.rowPressed]}
            onPress={goEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit profile">
            <Text style={styles.rowLabel}>Edit profile</Text>
            <Icon name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [styles.row, styles.rowBottom, pressed && styles.rowPressed]}
            onPress={goSaved}
            accessibilityRole="button"
            accessibilityLabel={`Saved listings, ${savedCount} items`}>
            <Text style={styles.rowLabel}>Saved listings</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{savedCount}</Text>
              <Icon name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <AppearancePicker />
        </View>

        <View style={styles.logoutWrap}>
          <Button
            title="Log out"
            variant="secondary"
            loading={loggingOut}
            onPress={onLogout}
            accessibilityLabel="Log out of your account"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileHeaderSkeleton() {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xxxl, gap: theme.spacing.md }}>
      <Skeleton width={80} height={80} radius={40} tone="elevated" />
      <Skeleton width={180} height={28} />
      <Skeleton width={220} height={16} />
    </View>
  );
}

function createStyles(theme: Theme) {
  const padX = theme.spacing.xl;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bg },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
    },
    content: {
      paddingHorizontal: padX,
      paddingTop: 0,
      paddingBottom: theme.spacing.xxxl,
    },

    header: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    avatarText: {
      ...theme.typography.display,
      color: theme.colors.primary,
      fontSize: 36,
      lineHeight: 42,
    },
    name: {
      ...theme.typography.display,
      fontSize: 26,
      lineHeight: 30,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    email: {
      ...theme.typography.body,
      color: theme.colors.muted,
    },

    sectionLabel: {
      ...theme.typography.overline,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
    rowGroup: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginLeft: theme.spacing.lg,
    },
    row: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    rowTop: {},
    rowBottom: {},
    rowPressed: { backgroundColor: theme.colors.cardElevated },
    rowLabel: { ...theme.typography.body, color: theme.colors.text },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    rowValue: {
      ...theme.typography.body,
      color: theme.colors.muted,
      fontVariant: ['tabular-nums'],
    },
    section: { marginTop: theme.spacing.xxl },

    logoutWrap: { marginTop: theme.spacing.xxl },
  });
}
