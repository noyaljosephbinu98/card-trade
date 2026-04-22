import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AuthStackParamList } from '@/app/types';
import { Button, Input } from '@/components';
import { useTheme, type Theme } from '@/features/theme';

import { registerSchema, type RegisterInput } from '../schemas';
import { useAuthStore } from '../store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const register = useAuthStore((s) => s.register);
  const [submitting, setSubmitting] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = useCallback(
    async (values: RegisterInput) => {
      setSubmitting(true);
      try {
        await register(values);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Sign up failed';
        Alert.alert('Could not create account', msg);
      } finally {
        setSubmitting(false);
      }
    },
    [register],
  );

  const goLogin = useCallback(() => navigation.navigate('Login'), [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.wordmark}>AltLite</Text>

          <Text style={styles.heroTitle} accessibilityRole="header">
            Create account
          </Text>
          <Text style={styles.heroSubtitle}>
            Your saved listings and portfolio stay with you.
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="DISPLAY NAME"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.displayName?.message}
                  placeholder="How collectors see you"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="EMAIL"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  error={errors.email?.message}
                  placeholder="you@example.com"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="PASSWORD"
                  helperText="At least 8 characters."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!pwVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={errors.password?.message}
                  placeholder="••••••••"
                  rightAdornment={
                    <Pressable
                      onPress={() => setPwVisible((v) => !v)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityState={{ selected: pwVisible }}
                      accessibilityLabel={pwVisible ? 'Hide password' : 'Show password'}>
                      <Text style={styles.toggleText}>{pwVisible ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="CONFIRM PASSWORD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!confirmVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={errors.confirmPassword?.message}
                  placeholder="••••••••"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  rightAdornment={
                    <Pressable
                      onPress={() => setConfirmVisible((v) => !v)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityState={{ selected: confirmVisible }}
                      accessibilityLabel={
                        confirmVisible ? 'Hide confirmation password' : 'Show confirmation password'
                      }>
                      <Text style={styles.toggleText}>{confirmVisible ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  }
                />
              )}
            />
          </View>

          <View style={styles.spacer} />

          <Button
            title="Create account"
            loading={submitting}
            onPress={handleSubmit(onSubmit)}
            accessibilityLabel="Create a new AltLite account"
          />

          <Pressable
            onPress={goLogin}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Sign in to an existing account"
            style={styles.footerLink}>
            <Text style={styles.footerText}>
              Already a collector? <Text style={styles.footerAccent}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  const padX = theme.spacing.xl;
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.bg },
    flex: { flex: 1 },
    scroll: {
      paddingHorizontal: padX,
      paddingTop: theme.spacing.xxxl,
      paddingBottom: theme.spacing.xl,
      flexGrow: 1,
    },
    wordmark: {
      ...theme.typography.display,
      fontSize: 22,
      lineHeight: 26,
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.xxxl,
    },
    heroTitle: {
      ...theme.typography.display,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    heroSubtitle: {
      ...theme.typography.body,
      color: theme.colors.muted,
      textAlign: 'center',
      marginBottom: theme.spacing.xxl,
    },
    form: {},
    toggleText: {
      ...theme.typography.meta,
      color: theme.colors.muted,
      fontWeight: '600',
    },
    spacer: { flexGrow: 1, minHeight: theme.spacing.xl },
    footerLink: {
      alignSelf: 'center',
      marginTop: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
    },
    footerText: {
      ...theme.typography.body,
      color: theme.colors.muted,
      textAlign: 'center',
    },
    footerAccent: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
}
