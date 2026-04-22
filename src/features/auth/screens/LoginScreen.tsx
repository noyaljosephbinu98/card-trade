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

import { loginSchema, type LoginInput } from '../schemas';
import { useAuthStore } from '../store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const login = useAuthStore(s => s.login);
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const onSubmit = useCallback(
    async (values: LoginInput) => {
      setSubmitting(true);
      try {
        await login(values);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Sign in failed';
        Alert.alert('Sign in failed', msg);
      } finally {
        setSubmitting(false);
      }
    },
    [login],
  );

  const goRegister = useCallback(() => navigation.navigate('Register'), [navigation]);
  const onForgot = useCallback(() => {
    Alert.alert('Reset password', 'We’ll email you a secure link to set a new password.');
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.wordmark}>AltLite</Text>

          <Text style={styles.heroTitle} accessibilityRole="header">
            Welcome
          </Text>

          <View style={styles.form}>
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
                  returnKeyType="next"
                  error={errors.email?.message}
                  placeholder="you@example.com"
                  accessibilityLabel="Email address"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="PASSWORD"
                  labelRight={
                    <Pressable
                      onPress={onForgot}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Forgot password"
                    >
                      <Text style={styles.linkSm}>Forgot?</Text>
                    </Pressable>
                  }
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  error={errors.password?.message}
                  placeholder="••••••••"
                  accessibilityLabel="Password"
                  rightAdornment={
                    <Pressable
                      onPress={() => setPasswordVisible(v => !v)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityState={{ selected: passwordVisible }}
                      accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      <Text style={styles.toggleText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  }
                />
              )}
            />
          </View>

          <View style={styles.spacer} />

          <Button
            title="Sign in"
            loading={submitting}
            onPress={handleSubmit(onSubmit)}
            accessibilityLabel="Sign in to your AltLite account"
          />

          <Pressable
            onPress={goRegister}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Create an AltLite account"
            style={styles.footerLink}
          >
            <Text style={styles.footerText}>
              New to AltLite? <Text style={styles.footerAccent}>Create account</Text>
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
      marginBottom: theme.spacing.xxl,
    },

    form: {},

    linkSm: {
      ...theme.typography.meta,
      color: theme.colors.primary,
      fontWeight: '600',
    },
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
