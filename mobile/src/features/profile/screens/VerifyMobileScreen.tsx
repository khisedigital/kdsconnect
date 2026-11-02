import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  RetailerStackParamList,
  SalesStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Badge,
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
import {
  formatIndianMobileDisplay,
  isValidIndianMobile,
  normalizeIndianMobile,
} from '../../../utils/phone';
import {useAuth} from '../../auth/AuthContext';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'VerifyMobile'>
  | NativeStackScreenProps<SupplierStackParamList, 'VerifyMobile'>
  | NativeStackScreenProps<SalesStackParamList, 'VerifyMobile'>;

const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .refine(isValidIndianMobile, 'Enter a valid 10-digit Indian mobile number'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export function VerifyMobileScreen({navigation}: Props) {
  const {user, refreshUser} = useAuth();
  const [busy, setBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState(
    user?.phone ? normalizeIndianMobile(user.phone) ?? '' : '',
  );

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: user?.phone ? normalizeIndianMobile(user.phone) ?? '' : '',
    },
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {otp: ''},
  });

  const onSendOtp = phoneForm.handleSubmit(async values => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'Mobile OTP verification waits on the confirmed SMS / auth contract.',
        );
        return;
      }
      const normalized = normalizeIndianMobile(values.phone)!;
      const result = await getAppApi().auth.startMobileVerification({
        phone: normalized,
      });
      setPendingPhone(normalized);
      setOtpSent(true);
      setOtpHint(result.otpHint);
      otpForm.reset({otp: ''});
      Alert.alert('OTP sent', result.otpHint);
    } catch (error) {
      Alert.alert(
        'Could not send OTP',
        error instanceof ApiClientError
          ? error.message
          : 'Check the mobile number and try again.',
      );
    } finally {
      setBusy(false);
    }
  });

  const onVerify = otpForm.handleSubmit(async values => {
    if (busy || !pendingPhone) {
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'OTP verification requires the confirmed auth API.',
        );
        return;
      }
      await getAppApi().auth.verifyMobileOtp({
        phone: pendingPhone,
        otp: values.otp,
      });
      await refreshUser();
      Alert.alert(
        'Mobile verified',
        `${formatIndianMobileDisplay(pendingPhone)} is linked to your account.`,
        [{text: 'Done', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof ApiClientError
          ? error.message
          : 'Invalid OTP. Try again.',
      );
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Mobile verification"
        kicker="Contact"
        description="Validate an Indian mobile number with OTP. Required for sales field outreach."
        icon="phone"
        tone="teal"
        onBack={() => navigation.goBack()}
      />

      <Card style={styles.statusCard}>
        <Text variant="h3">Current status</Text>
        <Text variant="bodySmall" color="secondary">
          {user?.phone
            ? formatIndianMobileDisplay(user.phone)
            : 'No mobile on file'}
        </Text>
        <Badge
          label={user?.phoneVerified ? 'Verified' : 'Not verified'}
          variant={user?.phoneVerified ? 'success' : 'warning'}
        />
        {appConfig.enableDevPreview ? (
          <Text variant="caption" color="warning" style={styles.devNote}>
            Development preview — OTP is 123456. Not a live SMS gateway.
          </Text>
        ) : null}
      </Card>

      <Card style={styles.card}>
        <Text variant="label">Step 1 · Mobile number</Text>
        <Text variant="bodySmall" color="secondary" style={styles.hint}>
          Enter a 10-digit Indian mobile (starts with 6–9). +91 is optional.
        </Text>
        <FormTextField
          control={phoneForm.control}
          name="phone"
          label="Mobile number"
          placeholder="9876543210"
          keyboardType="phone-pad"
          maxLength={14}
        />
        <Button
          title={otpSent ? 'Resend OTP' : 'Send OTP'}
          fullWidth
          loading={busy && !otpSent}
          onPress={() => void onSendOtp()}
        />
      </Card>

      {otpSent ? (
        <Card style={styles.card}>
          <Text variant="label">Step 2 · Enter OTP</Text>
          {otpHint ? (
            <Text variant="bodySmall" color="secondary" style={styles.hint}>
              {otpHint}
            </Text>
          ) : null}
          <FormTextField
            control={otpForm.control}
            name="otp"
            label="One-time password"
            placeholder="6-digit OTP"
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button
            title="Verify mobile"
            fullWidth
            size="lg"
            loading={busy && otpSent}
            onPress={() => void onVerify()}
          />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    gap: spacing[2],
    marginBottom: spacing[3],
    alignItems: 'flex-start',
  },
  card: {gap: spacing[3], marginBottom: spacing[3]},
  hint: {lineHeight: 20},
  devNote: {marginTop: spacing[1], lineHeight: 18},
});
