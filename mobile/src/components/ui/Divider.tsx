import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export interface DividerProps extends ViewProps {
  inset?: boolean;
}

export function Divider({inset = false, style, ...rest}: DividerProps) {
  return (
    <View
      style={[styles.divider, inset && styles.inset, style]}
      accessibilityRole="none"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },
  inset: {
    marginLeft: spacing[4],
  },
});
