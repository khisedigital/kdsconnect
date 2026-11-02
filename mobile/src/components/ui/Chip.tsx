import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function Chip({
  label,
  selected = false,
  onPress,
  disabled = false,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected, disabled}}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({pressed}) => [
        styles.chip,
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
        pressed && !disabled && styles.chipPressed,
      ]}>
      <Text
        variant="caption"
        color={selected ? 'inverse' : disabled ? 'disabled' : 'primary'}
        style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipPressed: {
    opacity: 0.9,
  },
  label: {
    fontWeight: '600',
  },
});
