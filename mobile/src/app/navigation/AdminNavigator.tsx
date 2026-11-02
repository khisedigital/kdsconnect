import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {Icon} from '../../components/ui/Icon';
import {AdminAccountScreen} from '../../features/admin/screens/AdminAccountScreen';
import {AdminDashboardScreen} from '../../features/admin/screens/AdminDashboardScreen';
import {AdminOrdersScreen} from '../../features/admin/screens/AdminOrdersScreen';
import {AdminOverviewScreen} from '../../features/admin/screens/AdminOverviewScreen';
import {AdminQuotationsScreen} from '../../features/admin/screens/AdminQuotationsScreen';
import {AdminSupportQueriesScreen} from '../../features/admin/screens/AdminSupportQueriesScreen';
import {ChangePasswordScreen} from '../../features/profile/screens/ChangePasswordScreen';
import {PreferencesScreen} from '../../features/profile/screens/PreferencesScreen';
import {PrivacySecurityScreen} from '../../features/profile/screens/PrivacySecurityScreen';
import {SupportScreen} from '../../features/profile/screens/SupportScreen';
import {colors} from '../../theme/colors';
import type {AdminStackParamList, AdminTabParamList} from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function DashboardTabIcon({focused}: {focused: boolean}) {
  return <Icon name="home" color={focused ? 'accent' : 'secondary'} />;
}

function OverviewTabIcon({focused}: {focused: boolean}) {
  return <Icon name="alert" color={focused ? 'accent' : 'secondary'} />;
}

function OrdersTabIcon({focused}: {focused: boolean}) {
  return <Icon name="orders" color={focused ? 'accent' : 'secondary'} />;
}

function QuotationsTabIcon({focused}: {focused: boolean}) {
  return <Icon name="quote" color={focused ? 'accent' : 'secondary'} />;
}

function AccountTabIcon({focused}: {focused: boolean}) {
  return <Icon name="account" color={focused ? 'accent' : 'secondary'} />;
}

function AdminTabs() {
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
        component={AdminDashboardScreen}
        options={{tabBarIcon: DashboardTabIcon}}
      />
      <Tab.Screen
        name="Overview"
        component={AdminOverviewScreen}
        options={{tabBarIcon: OverviewTabIcon}}
      />
      <Tab.Screen
        name="Orders"
        component={AdminOrdersScreen}
        options={{tabBarIcon: OrdersTabIcon}}
      />
      <Tab.Screen
        name="Quotations"
        component={AdminQuotationsScreen}
        options={{tabBarIcon: QuotationsTabIcon}}
      />
      <Tab.Screen
        name="Account"
        component={AdminAccountScreen}
        options={{tabBarIcon: AccountTabIcon}}
      />
    </Tab.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen
        name="SupportQueries"
        component={AdminSupportQueriesScreen}
      />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Privacy" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
}
