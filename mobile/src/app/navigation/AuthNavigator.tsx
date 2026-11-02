import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DevPreviewScreen } from '../../features/auth/screens/DevPreviewScreen';
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen';
import { RegisterRetailerScreen } from '../../features/auth/screens/RegisterRetailerScreen';
import { RegisterRoleScreen } from '../../features/auth/screens/RegisterRoleScreen';
import { RegisterSupplierScreen } from '../../features/auth/screens/RegisterSupplierScreen';
import { SignInScreen } from '../../features/auth/screens/SignInScreen';
import { SplashScreen } from '../../features/auth/screens/SplashScreen';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { colors } from '../../theme/colors';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="RegisterRole" component={RegisterRoleScreen} />
      <Stack.Screen name="RegisterRetailer" component={RegisterRetailerScreen} />
      <Stack.Screen name="RegisterSupplier" component={RegisterSupplierScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="DevPreview" component={DevPreviewScreen} />
    </Stack.Navigator>
  );
}
