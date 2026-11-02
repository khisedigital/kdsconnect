import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Icon} from '../../components/ui/Icon';
import {ChangePasswordScreen} from '../../features/profile/screens/ChangePasswordScreen';
import {PreferencesScreen} from '../../features/profile/screens/PreferencesScreen';
import {PrivacySecurityScreen} from '../../features/profile/screens/PrivacySecurityScreen';
import {SupportScreen} from '../../features/profile/screens/SupportScreen';
import {VerifyMobileScreen} from '../../features/profile/screens/VerifyMobileScreen';
import {SalesAccountScreen} from '../../features/sales/screens/SalesAccountScreen';
import {SalesAccountsListScreen} from '../../features/sales/screens/SalesAccountsListScreen';
import {SalesDashboardScreen} from '../../features/sales/screens/SalesDashboardScreen';
import {SalesOnboardRetailerScreen} from '../../features/sales/screens/SalesOnboardRetailerScreen';
import {SalesOnboardWholesalerScreen} from '../../features/sales/screens/SalesOnboardWholesalerScreen';
import {colors} from '../../theme/colors';
import type {SalesStackParamList, SalesTabParamList} from './types';

const Tab = createBottomTabNavigator<SalesTabParamList>();
const Stack = createNativeStackNavigator<SalesStackParamList>();

function DashboardTabIcon({focused}: {focused: boolean}) {
  return <Icon name="home" color={focused ? 'accent' : 'secondary'} />;
}

function AccountsTabIcon({focused}: {focused: boolean}) {
  return <Icon name="group" color={focused ? 'accent' : 'secondary'} />;
}

function AccountTabIcon({focused}: {focused: boolean}) {
  return <Icon name="account" color={focused ? 'accent' : 'secondary'} />;
}

function SalesTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={SalesDashboardScreen}
        options={{tabBarIcon: DashboardTabIcon}}
      />
      <Tab.Screen
        name="Accounts"
        component={SalesAccountsListScreen}
        options={{tabBarIcon: AccountsTabIcon}}
      />
      <Tab.Screen
        name="Account"
        component={SalesAccountScreen}
        options={{tabBarIcon: AccountTabIcon}}
      />
    </Tab.Navigator>
  );
}

export function SalesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="SalesTabs" component={SalesTabs} />
      <Stack.Screen name="OnboardRetailer" component={SalesOnboardRetailerScreen} />
      <Stack.Screen
        name="OnboardWholesaler"
        component={SalesOnboardWholesalerScreen}
      />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Privacy" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
}
