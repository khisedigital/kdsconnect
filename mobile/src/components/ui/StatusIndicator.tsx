import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export type StatusIndicatorVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusIndicatorProps {
  label: string;
  variant?: StatusIndicatorVariant;
}

const dotColors: Record<StatusIndicatorVariant, string> = {
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
  neutral: colors.text.disabled,
};

const textColors: Record<
  StatusIndicatorVariant,
  'success' | 'warning' | 'error' | 'info' | 'secondary'
> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'secondary',
};

export function StatusIndicator({
  label,
  variant = 'neutral',
}: StatusIndicatorProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, {backgroundColor: dotColors[variant]}]} />
      <Text variant="bodySmall" color={textColors[variant]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[2],
  },
});
