import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({label, variant = 'neutral', style, ...rest}: BadgeProps) {
  const palette = colors.statusBadge[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        style,
      ]}
      {...rest}>
      <Text variant="caption" style={{color: palette.text}}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1] / 2,
    borderRadius: radii.full,
    borderWidth: 1,
  },
});
