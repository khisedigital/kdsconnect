import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Button,
  Card,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {isValidIndianMobile, normalizeIndianMobile} from '../../../utils/phone';
import {forgotPasswordSchema, type ForgotPasswordFormValues} from '../schemas';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {control, handleSubmit, formState} = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {identifier: ''},
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async values => {
    setSubmitError(null);
    try {
      const raw = values.identifier.trim();
      const email = isValidIndianMobile(raw)
        ? `${normalizeIndianMobile(raw)}@phone.kdsconnect.local`
        : raw;
      await getAppApi().auth.requestPasswordReset({email});
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Unable to send reset instructions. Try again later.';
      setSubmitError(message);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Reset password"
        kicker="Account recovery"
        description="Works for sales, admin, retailer, and wholesaler accounts — use email or registered mobile."
        icon="lock"
        tone="deep"
        onBack={() => navigation.goBack()}
      />

      {submitted ? (
        <Card style={styles.card}>
          <Text variant="h3">Check your inbox / SMS</Text>
          <Text variant="bodySmall" color="secondary" style={styles.successBody}>
            If an account exists for that email or mobile, reset instructions
            will be sent once the API endpoint is live.
          </Text>
          <Button
            title="Back to sign in"
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('SignIn')}
          />
        </Card>
      ) : (
        <Card style={styles.card}>
          <FormTextField
            control={control}
            name="identifier"
            label="Email or mobile"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@company.com or 9876543210"
          />
          {submitError ? (
            <Text variant="bodySmall" color="error">
              {submitError}
            </Text>
          ) : null}
          <Button
            title="Send reset instructions"
            fullWidth
            size="lg"
            loading={formState.isSubmitting}
            onPress={() => void onSubmit()}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  successBody: {
    marginVertical: spacing[2],
    lineHeight: 20,
  },
});
