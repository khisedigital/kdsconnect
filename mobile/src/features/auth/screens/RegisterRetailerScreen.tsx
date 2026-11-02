import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import type { AuthStackParamList } from '../../../app/navigation/types';
import { FormPasswordField } from '../../../components/forms/FormPasswordField';
import { FormTextField } from '../../../components/forms/FormTextField';
import { Button } from '../../../components/ui/Button';
import { Header } from '../../../components/ui/Header';
import { Screen } from '../../../components/ui/Screen';
import { Text } from '../../../components/ui/Text';
import { ApiClientError } from '../../../services/api/errors';
import { spacing } from '../../../theme/spacing';
import { useAuth } from '../AuthContext';
import {
  registerRetailerSchema,
  type RegisterRetailerFormValues,
} from '../schemas';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RegisterRetailer'>;

export function RegisterRetailerScreen() {
  const navigation = useNavigation<Nav>();
  const { registerRetailer } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<RegisterRetailerFormValues>({
    resolver: zodResolver(registerRetailerSchema),
    defaultValues: {
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      gstNumber: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async values => {
    setSubmitError(null);
    try {
      await registerRetailer({
        email: values.email,
        password: values.password,
        displayName: values.contactName,
        businessName: values.businessName,
        phone: values.phone,
      });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Registration failed. Please try again.';
      setSubmitError(message);
    }
  });

  return (
    <Screen scroll keyboardAvoiding contentContainerStyle={styles.content}>
      <Header
        title="Retailer registration"
        left={
          <Text
            variant="label"
            color="accent"
            onPress={() => navigation.goBack()}
            accessibilityRole="button">
            Back
          </Text>
        }
      />

      <Text variant="bodySmall" color="secondary">
        Fields match the proposed retailer onboarding contract (subject to API confirmation).
      </Text>

      <View style={styles.form}>
        <FormTextField control={control} name="businessName" label="Business name" />
        <FormTextField control={control} name="contactName" label="Contact name" />
        <FormTextField
          control={control}
          name="email"
          label="Work email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <FormTextField
          control={control}
          name="phone"
          label="Phone (optional)"
          keyboardType="phone-pad"
        />
        <FormTextField
          control={control}
          name="gstNumber"
          label="GST / tax ID (optional)"
          autoCapitalize="characters"
        />
        <FormPasswordField control={control} name="password" label="Password" />
        <FormPasswordField control={control} name="confirmPassword" label="Confirm password" />

        {submitError ? (
          <Text variant="bodySmall" color="error">
            {submitError}
          </Text>
        ) : null}

        <Button
          title="Create retailer account"
          fullWidth
          loading={formState.isSubmitting}
          onPress={() => void onSubmit()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    paddingBottom: spacing[8],
    gap: spacing[4],
  },
  form: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing[4],
  },
});
