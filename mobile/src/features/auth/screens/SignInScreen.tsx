import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Pressable, StyleSheet, View} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {FormPasswordField} from '../../../components/forms/FormPasswordField';
import {FormTextField} from '../../../components/forms/FormTextField';
import {Atmosphere} from '../../../components/ui/Atmosphere';
import {BrandMark} from '../../../components/ui/BrandMark';
import {Button} from '../../../components/ui/Button';
import {Card} from '../../../components/ui/Card';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {appConfig} from '../../../config/env';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {useAuth} from '../AuthContext';
import {signInSchema, type SignInFormValues} from '../schemas';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<Nav>();
  const {signIn} = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {control, handleSubmit, formState} = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {identifier: '', password: ''},
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async values => {
    setSubmitError(null);
    try {
      await signIn(values.identifier, values.password);
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Unable to sign in. Check your credentials and try again.';
      setSubmitError(message);
    }
  });

  const showDevPreviewEntry = appConfig.enableDevPreview && __DEV__;

  return (
    <Atmosphere variant="auth">
      <Screen
        scroll
        keyboardAvoiding
        backgroundColor="transparent"
        edges={['top', 'bottom']}
        contentContainerStyle={styles.content}>
        <FadeIn>
          <View style={styles.hero}>
            <BrandMark size="lg" tone="inverse" showWordmark align="start" />
            <Text variant="bodySmall" color="inverse" style={styles.heroLine}>
              Sign in to manage wholesale purchasing for your business.
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={120}>
          <Card padding="lg" style={[styles.formCard, elevation[3]]}>
            <Text variant="h2">Welcome back</Text>
            <Text variant="bodySmall" color="secondary" style={styles.subtitle}>
              Use your business email or registered phone number.
            </Text>

            <View style={styles.fields}>
              <FormTextField
                control={control}
                name="identifier"
                label="Email or phone"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
                returnKeyType="next"
              />
              <FormPasswordField
                control={control}
                name="password"
                label="Password"
                returnKeyType="done"
                onSubmitEditing={() => void onSubmit()}
              />
            </View>

            {submitError ? (
              <View style={styles.errorBox}>
                <Text variant="bodySmall" color="error">
                  {submitError}
                </Text>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgot}>
              <Text variant="label" color="accent">
                Forgot password?
              </Text>
            </Pressable>

            <Button
              title="Sign in"
              size="lg"
              fullWidth
              loading={formState.isSubmitting}
              onPress={() => void onSubmit()}
            />
          </Card>
        </FadeIn>

        <View style={styles.registerRow}>
          <Text variant="bodySmall" color="secondary">
            New to KDS Connect?
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('RegisterRole')}>
            <Text variant="label" color="accent">
              Create account
            </Text>
          </Pressable>
        </View>

        {showDevPreviewEntry ? (
          <Card padding="md" style={styles.devCard}>
            <Text variant="caption" color="warning">
              Development preview
            </Text>
            <Text variant="bodySmall" color="secondary" style={styles.devHint}>
              Opens fixture data only. Not a production login bypass.
            </Text>
            <Button
              title="Open development preview"
              variant="outline"
              size="sm"
              fullWidth
              onPress={() => navigation.navigate('DevPreview')}
            />
          </Card>
        ) : null}
      </Screen>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    paddingBottom: spacing[10],
  },
  hero: {
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  heroLine: {
    opacity: 0.9,
    maxWidth: 300,
  },
  formCard: {
    gap: spacing[3],
    marginTop: -spacing[2],
    borderRadius: radii.xl,
  },
  subtitle: {
    marginBottom: spacing[2],
  },
  fields: {
    gap: spacing[4],
  },
  errorBox: {
    backgroundColor: colors.statusBadge.error.background,
    borderRadius: radii.md,
    padding: spacing[3],
  },
  forgot: {
    alignSelf: 'flex-end',
    paddingVertical: spacing[1],
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  devCard: {
    gap: spacing[2],
    borderStyle: 'dashed',
    borderColor: colors.semantic.warning,
  },
  devHint: {
    marginBottom: spacing[1],
  },
});
