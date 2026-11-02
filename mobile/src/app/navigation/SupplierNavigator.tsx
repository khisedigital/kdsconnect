import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Icon } from '../../components/ui/Icon';
import { DashboardScreen } from '../../features/supplier/screens/DashboardScreen';
import { SupplierAccountScreen } from '../../features/supplier/screens/SupplierAccountScreen';
import { SupplierOrdersScreen } from '../../features/supplier/screens/SupplierOrdersScreen';
import { SupplierProductsScreen } from '../../features/supplier/screens/SupplierProductsScreen';
import { SupplierRfqsScreen } from '../../features/supplier/screens/SupplierRfqsScreen';
import { colors } from '../../theme/colors';
import { NotificationsScreen } from '../../features/notifications/screens/NotificationsScreen';
import { BusinessProfileScreen } from '../../features/profile/screens/BusinessProfileScreen';
import { BusinessVerificationScreen } from '../../features/profile/screens/BusinessVerificationScreen';
import { ChangePasswordScreen } from '../../features/profile/screens/ChangePasswordScreen';
import { KycScreen } from '../../features/profile/screens/KycScreen';
import { PreferencesScreen } from '../../features/profile/screens/PreferencesScreen';
import { PrivacySecurityScreen } from '../../features/profile/screens/PrivacySecurityScreen';
import { SupportScreen } from '../../features/profile/screens/SupportScreen';
import { VerifyMobileScreen } from '../../features/profile/screens/VerifyMobileScreen';
import { SupplierOrderDetailsScreen } from '../../features/supplier/screens/SupplierOrderDetailsScreen';
import { SupplierQuotationFormScreen } from '../../features/supplier/screens/SupplierQuotationFormScreen';
import { SupplierRfqDetailsScreen } from '../../features/supplier/screens/SupplierRfqDetailsScreen';
import { FeaturePlaceholderScreen } from './FeaturePlaceholderScreen';
import type { SupplierStackParamList, SupplierTabParamList } from './types';

const Tab = createBottomTabNavigator<SupplierTabParamList>();
const Stack = createNativeStackNavigator<SupplierStackParamList>();

function DashboardTabIcon({focused}: {focused: boolean}) {
  return <Icon name="home" color={focused ? 'accent' : 'secondary'} />;
}

function RfqsTabIcon({focused}: {focused: boolean}) {
  return <Icon name="quote" color={focused ? 'accent' : 'secondary'} />;
}

function SupplierOrdersTabIcon({focused}: {focused: boolean}) {
  return <Icon name="orders" color={focused ? 'accent' : 'secondary'} />;
}

function SupplierProductsTabIcon({focused}: {focused: boolean}) {
  return <Icon name="products" color={focused ? 'accent' : 'secondary'} />;
}

function SupplierAccountTabIcon({focused}: {focused: boolean}) {
  return <Icon name="account" color={focused ? 'accent' : 'secondary'} />;
}

function SupplierTabs() {
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
        component={DashboardScreen}
        options={{tabBarIcon: DashboardTabIcon}}
      />
      <Tab.Screen
        name="Rfqs"
        component={SupplierRfqsScreen}
        options={{title: 'RFQs', tabBarIcon: RfqsTabIcon}}
      />
      <Tab.Screen
        name="Orders"
        component={SupplierOrdersScreen}
        options={{tabBarIcon: SupplierOrdersTabIcon}}
      />
      <Tab.Screen
        name="Products"
        component={SupplierProductsScreen}
        options={{tabBarIcon: SupplierProductsTabIcon}}
      />
      <Tab.Screen
        name="Account"
        component={SupplierAccountScreen}
        options={{tabBarIcon: SupplierAccountTabIcon}}
      />
    </Tab.Navigator>
  );
}

export function SupplierNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="SupplierTabs" component={SupplierTabs} />
      <Stack.Screen name="SupplierRfqDetails" component={SupplierRfqDetailsScreen} />
      <Stack.Screen name="SupplierQuotationForm" component={SupplierQuotationFormScreen} />
      <Stack.Screen name="SupplierOrderDetails" component={SupplierOrderDetailsScreen} />
      <Stack.Screen
        name="SupplierProductDetails"
        children={() => (
          <FeaturePlaceholderScreen title="Product details" featureModule="Supplier products" />
        )}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
      <Stack.Screen name="Kyc" component={KycScreen} />
      <Stack.Screen
        name="BusinessVerification"
        component={BusinessVerificationScreen}
      />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
      <Stack.Screen name="Privacy" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
}
