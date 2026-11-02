import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { ToastProvider } from '../../components/feedback/Toast';
import { AuthProvider } from '../../features/auth/AuthContext';
import { linking } from '../navigation/linking';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from '../store';

export function AppProviders() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ToastProvider>
            <AuthProvider>
              <NavigationContainer linking={linking}>
                <StatusBar barStyle="dark-content" />
                <RootNavigator />
              </NavigationContainer>
            </AuthProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

