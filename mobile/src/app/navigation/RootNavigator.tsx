import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {useAuth} from '../../features/auth/AuthContext';
import {colors} from '../../theme/colors';
import {AdminNavigator} from './AdminNavigator';
import {AuthNavigator} from './AuthNavigator';
import {RetailerNavigator} from './RetailerNavigator';
import {SalesNavigator} from './SalesNavigator';
import {SupplierNavigator} from './SupplierNavigator';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const {status, user, isBootstrapping} = useAuth();

  if (isBootstrapping || status === 'unknown') {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const role = user?.role;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {status === 'authenticated' && role === 'retailer' ? (
        <Stack.Screen name="Retailer" component={RetailerNavigator} />
      ) : null}
      {status === 'authenticated' && role === 'supplier' ? (
        <Stack.Screen name="Supplier" component={SupplierNavigator} />
      ) : null}
      {status === 'authenticated' && role === 'sales' ? (
        <Stack.Screen name="Sales" component={SalesNavigator} />
      ) : null}
      {status === 'authenticated' && role === 'admin' ? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : null}
      {status !== 'authenticated' ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : null}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
