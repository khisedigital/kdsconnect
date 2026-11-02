import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Icon} from './Icon';
import {Text} from './Text';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unitLabel?: string;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  unitLabel,
  disabled = false,
}: QuantityStepperProps) {
  const boundedMax = Math.max(min, max);
  const safeValue = clamp(value, min, boundedMax);
  const atMin = safeValue <= min;
  const atMax = safeValue >= boundedMax;

  const decrement = useCallback(() => {
    if (disabled || atMin) {
      return;
    }
    onChange(clamp(safeValue - step, min, boundedMax));
  }, [atMin, boundedMax, disabled, min, onChange, safeValue, step]);

  const increment = useCallback(() => {
    if (disabled || atMax) {
      return;
    }
    onChange(clamp(safeValue + step, min, boundedMax));
  }, [atMax, boundedMax, disabled, min, onChange, safeValue, step]);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={disabled || atMin}
        onPress={decrement}
        style={({pressed}) => [
          styles.button,
          (disabled || atMin) && styles.buttonDisabled,
          pressed && !disabled && !atMin && styles.buttonPressed,
        ]}>
        <Icon name="minus" color={disabled || atMin ? 'muted' : 'primary'} size={18} />
      </Pressable>
      <View style={styles.valueWrap}>
        <Text variant="body" align="center">
          {safeValue}
        </Text>
        {unitLabel ? (
          <Text variant="caption" color="secondary" align="center">
            {unitLabel}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={disabled || atMax}
        onPress={increment}
        style={({pressed}) => [
          styles.button,
          (disabled || atMax) && styles.buttonDisabled,
          pressed && !disabled && !atMax && styles.buttonPressed,
        ]}>
        <Icon name="plus" color={disabled || atMax ? 'muted' : 'primary'} size={18} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    backgroundColor: colors.background,
  },
  valueWrap: {
    minWidth: 56,
    paddingHorizontal: spacing[2],
    alignItems: 'center',
  },
});
