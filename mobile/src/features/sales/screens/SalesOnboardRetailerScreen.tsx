import React, {useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {SalesStackParamList} from '../../../app/navigation/types';
import {FormPasswordField} from '../../../components/forms/FormPasswordField';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Button,
  Card,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {requiredIndianMobileField} from '../../auth/schemas';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {formatIndianMobileDisplay} from '../../../utils/phone';

type Props = NativeStackScreenProps<SalesStackParamList, 'OnboardRetailer'>;

const schema = z.object({
  displayName: z.string().trim().min(2, 'Enter contact name'),
  businessName: z.string().trim().min(2, 'Enter shop / business name'),
  email: z.string().trim().email('Enter a valid email'),
  phone: requiredIndianMobileField,
  city: z.string().optional(),
  password: z.string().min(4, 'Temporary password (min 4 chars)'),
});

type FormValues = z.infer<typeof schema>;

export function SalesOnboardRetailerScreen({navigation}: Props) {
  const [busy, setBusy] = useState(false);
  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: '',
      businessName: '',
      email: '',
      phone: '',
      city: '',
      password: '',
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
          'Sales onboarding waits on the confirmed account-creation API.',
        );
        return;
      }
      const created = await getAppApi().sales.onboardRetailer({
        displayName: values.displayName,
        businessName: values.businessName,
        email: values.email,
        phone: formatIndianMobileDisplay(values.phone),
        city: values.city,
        password: values.password,
      });
      reset();
      Alert.alert(
        'Retailer onboarded',
        `${created.businessName} can sign in with ${created.email}.`,
        [
          {
            text: 'View accounts',
            onPress: () =>
              navigation.navigate('SalesTabs', {screen: 'Accounts'}),
          },
          {text: 'OK'},
        ],
      );
    } catch (error) {
      Alert.alert(
        'Onboarding failed',
        error instanceof ApiClientError
          ? error.message
          : 'Could not create retailer account.',
      );
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Onboard retailer"
        kicker="Sales"
        description="Create a retailer login for a shop or kirana you are signing up."
        icon="building"
        tone="teal"
        onBack={() => navigation.goBack()}
      />
      <Card style={styles.card}>
        <Text variant="bodySmall" color="secondary" style={styles.hint}>
          Share the email and temporary password with the retailer after submit.
        </Text>
        <FormTextField control={control} name="displayName" label="Contact name" />
        <FormTextField
          control={control}
          name="businessName"
          label="Shop / business name"
        />
        <FormTextField
          control={control}
          name="email"
          label="Login email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <FormTextField
          control={control}
          name="phone"
          label="Mobile number"
          placeholder="10-digit Indian mobile"
          keyboardType="phone-pad"
          maxLength={14}
        />
        <FormTextField control={control} name="city" label="City (optional)" />
        <FormPasswordField
          control={control}
          name="password"
          label="Temporary password"
        />
      </Card>
      <Button
        title="Create retailer account"
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
