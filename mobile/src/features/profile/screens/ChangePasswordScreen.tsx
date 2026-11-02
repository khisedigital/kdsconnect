import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  AdminStackParamList,
  RetailerStackParamList,
  SalesStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {FormPasswordField} from '../../../components/forms/FormPasswordField';
import {
  Button,
  Card,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'ChangePassword'>
  | NativeStackScreenProps<SupplierStackParamList, 'ChangePassword'>
  | NativeStackScreenProps<SalesStackParamList, 'ChangePassword'>
  | NativeStackScreenProps<AdminStackParamList, 'ChangePassword'>;

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(128),
    confirmPassword: z.string().min(1, 'Confirm the new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordScreen({navigation}: Props) {
  const [busy, setBusy] = useState(false);
  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async values => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'Password change waits on the confirmed auth contract.',
        );
        return;
      }
      await getAppApi().auth.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      Alert.alert('Password updated', 'Use your new password next time you sign in.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert(
        'Could not update password',
        error instanceof ApiClientError
          ? error.message
          : 'Try again with your current password.',
      );
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Reset password"
        kicker="Security"
        description="Change the password for this account. Sales and all other roles use the same flow."
        icon="lock"
        tone="deep"
        onBack={() => navigation.goBack()}
      />
      <Card style={styles.card}>
        <Text variant="bodySmall" color="secondary" style={styles.hint}>
          Choose a strong password you do not reuse elsewhere.
        </Text>
        <FormPasswordField
          control={control}
          name="currentPassword"
          label="Current password"
        />
        <FormPasswordField
          control={control}
          name="newPassword"
          label="New password"
        />
        <FormPasswordField
          control={control}
          name="confirmPassword"
          label="Confirm new password"
        />
      </Card>
      <Button
        title="Update password"
        fullWidth
        size="lg"
        loading={busy}
        onPress={() => void onSubmit()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {gap: spacing[3], marginBottom: spacing[4]},
  hint: {lineHeight: 20, marginBottom: spacing[1]},
});
