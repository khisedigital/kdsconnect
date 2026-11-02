import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({message = 'Loading…'}: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text variant="bodySmall" color="secondary" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  message: {
    marginTop: spacing[3],
  },
});
