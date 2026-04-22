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

import type { ProfileStackParamList } from '@/app/types';
import { Button, Input } from '@/components';
import {
  passwordChangeSchema,
  profileUpdateSchema,
  type PasswordChangeInput,
  type ProfileUpdateInput,
  useAuthStore,
  useCurrentUser,
} from '@/features/auth';
import { useTheme, type Theme } from '@/features/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const user = useCurrentUser();
  const updateProfile = useAuthStore(s => s.updateProfile);
  const changePassword = useAuthStore(s => s.changePassword);

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  // ─── Profile details form ─────────────────────────────
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty: profileDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      email: user?.email ?? '',
    },
  });

  const onSaveProfile = useCallback(
    async (values: ProfileUpdateInput) => {
      setSubmittingProfile(true);
      try {
        await Promise.resolve(updateProfile(values));
        navigation.goBack();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Update failed';
        Alert.alert('Could not save', msg);
      } finally {
        setSubmittingProfile(false);
      }
    },
    [navigation, updateProfile],
  );

  // ─── Password change form ─────────────────────────────
  const {
    control: pwControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: pwErrors, isDirty: pwDirty },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChangePassword = useCallback(
    async (values: PasswordChangeInput) => {
      setSubmittingPassword(true);
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        resetPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        Alert.alert('Password updated', 'Your password has been changed.');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Could not change password';
        Alert.alert('Password not updated', msg);
      } finally {
        setSubmittingPassword(false);
      }
    },
    [changePassword, resetPassword],
  );

  const renderToggle = (visible: boolean, setter: (v: boolean) => void, labelFor: string) => (
    <Pressable
      onPress={() => setter(!visible)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: visible }}
      accessibilityLabel={visible ? `Hide ${labelFor}` : `Show ${labelFor}`}
    >
      <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Account details</Text>
          <Text style={styles.subtitle}>
            These show up across your AltLite listings and portfolio.
          </Text>

          <View style={styles.form}>
            <Controller
              control={profileControl}
              name="displayName"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="DISPLAY NAME"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={profileErrors.displayName?.message}
                  placeholder="How collectors see you"
                />
              )}
            />

            <Controller
              control={profileControl}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="EMAIL"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  error={profileErrors.email?.message}
                  helperText="We use this for receipts and auction alerts."
                />
              )}
            />

            <Button
              title="Save details"
              loading={submittingProfile}
              disabled={!profileDirty}
              onPress={handleProfileSubmit(onSaveProfile)}
              accessibilityLabel="Save profile changes"
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Password</Text>
          <Text style={styles.subtitle}>
            Pick something strong. You’ll need your current password to confirm the change.
          </Text>

          <View style={styles.form}>
            <Controller
              control={pwControl}
              name="currentPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="CURRENT PASSWORD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showCurrent}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  error={pwErrors.currentPassword?.message}
                  placeholder="••••••••"
                  rightAdornment={renderToggle(showCurrent, setShowCurrent, 'current password')}
                />
              )}
            />

            <Controller
              control={pwControl}
              name="newPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="NEW PASSWORD"
                  helperText="At least 8 characters."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={pwErrors.newPassword?.message}
                  placeholder="••••••••"
                  rightAdornment={renderToggle(showNew, setShowNew, 'new password')}
                />
              )}
            />

            <Controller
              control={pwControl}
              name="confirmNewPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="CONFIRM NEW PASSWORD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={pwErrors.confirmNewPassword?.message}
                  placeholder="••••••••"
                  returnKeyType="go"
                  onSubmitEditing={handlePasswordSubmit(onChangePassword)}
                  rightAdornment={renderToggle(
                    showConfirm,
                    setShowConfirm,
                    'confirmation password',
                  )}
                />
              )}
            />

            <Button
              title="Update password"
              loading={submittingPassword}
              disabled={!pwDirty}
              onPress={handlePasswordSubmit(onChangePassword)}
              accessibilityLabel="Update your password"
            />
          </View>

          <View style={styles.spacer} />

          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Cancel editing"
          />
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
    content: {
      paddingHorizontal: padX,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xxxl,
      flexGrow: 1,
    },
    title: {
      ...theme.typography.display,
      fontSize: 26,
      lineHeight: 30,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      ...theme.typography.display,
      fontSize: 22,
      lineHeight: 26,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.muted,
      marginBottom: theme.spacing.xl,
    },
    form: { gap: theme.spacing.sm },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.xxl,
    },
    toggleText: {
      ...theme.typography.meta,
      color: theme.colors.muted,
      fontWeight: '600',
    },
    spacer: { flexGrow: 1, minHeight: theme.spacing.xl },
  });
}
