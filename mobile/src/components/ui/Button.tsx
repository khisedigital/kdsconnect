import React, {useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const sizeStyles: Record<
  ButtonSize,
  {paddingVertical: number; paddingHorizontal: number; minHeight: number}
> = {
  sm: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    minHeight: 40,
  },
  md: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    minHeight: 56,
  },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const submittingRef = useRef(false);

  useEffect(() => {
    submittingRef.current = loading;
  }, [loading]);

  const handlePress = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (loading || disabled || submittingRef.current) {
        return;
      }
      submittingRef.current = true;
      try {
        onPress?.(event);
      } finally {
        submittingRef.current = false;
      }
    },
    [disabled, loading, onPress],
  );

  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];
  const dimensions = sizeStyles[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: loading}}
      disabled={isDisabled}
      onPress={handlePress}
      style={({pressed}) => [
        styles.base,
        variantStyle.container,
        variant === 'primary' || variant === 'secondary'
          ? elevation[2]
          : null,
        dimensions,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={variantStyle.spinnerColor} size="small" />
      ) : (
        <Text
          variant="button"
          color={isDisabled ? 'disabled' : variantStyle.textColor}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

type VariantConfig = {
  container: ViewStyle;
  textColor: 'primary' | 'secondary' | 'inverse' | 'disabled' | 'error';
  spinnerColor: string;
};

const variantStyles: Record<ButtonVariant, VariantConfig> = {
  primary: {
    container: {
      backgroundColor: colors.accent,
      borderWidth: 0,
    },
    textColor: 'inverse',
    spinnerColor: colors.text.inverse,
  },
  secondary: {
    container: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    textColor: 'inverse',
    spinnerColor: colors.text.inverse,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
    },
    textColor: 'primary',
    spinnerColor: colors.primary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    textColor: 'primary',
    spinnerColor: colors.primary,
  },
  danger: {
    container: {
      backgroundColor: colors.semantic.error,
      borderWidth: 0,
    },
    textColor: 'inverse',
    spinnerColor: colors.text.inverse,
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.985}],
  },
  disabled: {
    opacity: 0.45,
  },
});
