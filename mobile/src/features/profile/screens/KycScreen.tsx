import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  RetailerStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Badge,
  Button,
  Card,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {KycProfile, KycStatus} from '../../../types';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'Kyc'>
  | NativeStackScreenProps<SupplierStackParamList, 'Kyc'>;

const aadhaarSchema = z.object({
  aadhaarNumber: z
    .string()
    .refine(
      value => value.replace(/\D/g, '').length === 12,
      'Enter a valid 12-digit Aadhaar number',
    ),
});

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
});

type AadhaarForm = z.infer<typeof aadhaarSchema>;
type OtpForm = z.infer<typeof otpSchema>;

function statusBadge(
  status: KycStatus,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'verified':
      return 'success';
    case 'otp_sent':
    case 'pending_review':
      return 'warning';
    case 'rejected':
    case 'expired':
      return 'error';
    default:
      return 'neutral';
  }
}

function statusLabel(status: KycStatus): string {
  switch (status) {
    case 'not_started':
      return 'Not started';
    case 'otp_sent':
      return 'OTP sent';
    case 'pending_review':
      return 'Pending review';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    case 'expired':
      return 'Expired';
    default:
      return status;
  }
}

export function KycScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<KycProfile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const aadhaarForm = useForm<AadhaarForm>({
    resolver: zodResolver(aadhaarSchema),
    defaultValues: {aadhaarNumber: ''},
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {otp: ''},
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!appConfig.enableDevPreview) {
        setProfile({
          status: 'not_started',
          lastUpdatedAt: new Date().toISOString(),
          provider: 'aadhaar',
        });
        return;
      }
      const status = await getAppApi().kyc.getStatus();
      setProfile(status);
      if (status.status === 'otp_sent') {
        // Session may have been started earlier in this app session.
      } else {
        setSessionId(null);
        setOtpHint(null);
      }
    } catch {
      setProfile({
        status: 'not_started',
        lastUpdatedAt: new Date().toISOString(),
        provider: 'aadhaar',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onStart = aadhaarForm.handleSubmit(async values => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'Aadhaar KYC cannot run until the UIDAI / KYC partner contract is connected on the backend.',
        );
        return;
      }
      const result = await getAppApi().kyc.startAadhaarKyc({
        aadhaarNumber: values.aadhaarNumber.replace(/\D/g, ''),
      });
      setSessionId(result.sessionId);
      setOtpHint(result.otpHint ?? null);
      const status = await getAppApi().kyc.getStatus();
      setProfile(status);
      otpForm.reset({otp: ''});
      Alert.alert(
        'OTP sent',
        result.otpHint ??
          'Enter the OTP sent to your Aadhaar-linked mobile number.',
      );
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Could not start Aadhaar verification.';
      Alert.alert('KYC failed', message);
    } finally {
      setBusy(false);
    }
  });

  const onVerify = otpForm.handleSubmit(async values => {
    if (busy || !sessionId) {
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'OTP verification requires the confirmed KYC API contract.',
        );
        return;
      }
      const verified = await getAppApi().kyc.verifyAadhaarOtp({
        sessionId,
        otp: values.otp,
      });
      setProfile(verified);
      setSessionId(null);
      setOtpHint(null);
      Alert.alert(
        'KYC verified',
        'Your Aadhaar KYC is complete. You can now trade as a verified user.',
      );
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'OTP verification failed.';
      Alert.alert('Verification failed', message);
    } finally {
      setBusy(false);
    }
  });

  const isVerified = profile?.status === 'verified';
  const showOtpStep =
    Boolean(sessionId) || profile?.status === 'otp_sent';

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Aadhaar KYC"
        kicker="Identity verification"
        description="Only verified users can place requirements and trade on KDS Connect."
        icon="idCard"
        tone="teal"
        onBack={() => navigation.goBack()}
      />

      {loading || !profile ? (
        <LoadingState message="Loading KYC status…" />
      ) : (
        <>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIcon}>
                <Icon
                  name={isVerified ? 'check' : 'idCard'}
                  color={isVerified ? 'accent' : 'primary'}
                  size={20}
                />
              </View>
              <View style={styles.flex}>
                <Text variant="h3">Verification status</Text>
                <Text variant="caption" color="secondary">
                  Aadhaar-based e-KYC
                </Text>
              </View>
              <Badge
                label={statusLabel(profile.status)}
                variant={statusBadge(profile.status)}
              />
            </View>
            {profile.aadhaarMasked ? (
              <Text variant="bodySmall" color="secondary" style={styles.meta}>
                Aadhaar {profile.aadhaarMasked}
              </Text>
            ) : null}
            {profile.verifiedName ? (
              <Text variant="bodySmall" style={styles.meta}>
                Name on record: {profile.verifiedName}
              </Text>
            ) : null}
            {appConfig.enableDevPreview ? (
              <Text variant="caption" color="warning" style={styles.devNote}>
                Development preview — use OTP 123456 after sending Aadhaar OTP.
                Not a live UIDAI call.
              </Text>
            ) : null}
          </Card>

          {isVerified ? (
            <Card style={styles.card}>
              <Text variant="bodySmall" color="secondary">
                Your identity is verified. Re-verification will be required only
                if your KYC expires or compliance rules change.
              </Text>
            </Card>
          ) : (
            <>
              <Card style={styles.card}>
                <Text variant="label" style={styles.sectionLabel}>
                  Step 1 · Aadhaar number
                </Text>
                <Text variant="bodySmall" color="secondary" style={styles.hint}>
                  Enter the 12-digit Aadhaar linked to your registered mobile.
                  We never store the full number on this device after OTP is
                  sent.
                </Text>
                <FormTextField
                  control={aadhaarForm.control}
                  name="aadhaarNumber"
                  label="Aadhaar number"
                  placeholder="XXXX XXXX XXXX"
                  keyboardType="number-pad"
                  maxLength={14}
                  editable={!showOtpStep || !sessionId}
                />
                <Button
                  title={sessionId ? 'Resend OTP' : 'Send OTP'}
                  fullWidth
                  loading={busy && !sessionId}
                  onPress={() => void onStart()}
                />
              </Card>

              {showOtpStep ? (
                <Card style={styles.card}>
                  <Text variant="label" style={styles.sectionLabel}>
                    Step 2 · Verify OTP
                  </Text>
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
                    title="Verify & complete KYC"
                    fullWidth
                    size="lg"
                    loading={busy && Boolean(sessionId)}
                    onPress={() => void onVerify()}
                  />
                </Card>
              ) : null}
            </>
          )}

          <Card style={styles.footerCard}>
            <Text variant="caption" color="secondary" align="center">
              KYC is processed through a UIDAI-compliant partner on the server.
              KDS Connect only receives verification status and masked identity
              attributes required for wholesale compliance.
            </Text>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  meta: {marginTop: spacing[1]},
  devNote: {marginTop: spacing[2], lineHeight: 18},
  card: {
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  sectionLabel: {marginBottom: spacing[1]},
  hint: {lineHeight: 20, marginBottom: spacing[1]},
  footerCard: {
    marginTop: spacing[1],
    marginBottom: spacing[8],
    borderRadius: radii.xl,
  },
});
