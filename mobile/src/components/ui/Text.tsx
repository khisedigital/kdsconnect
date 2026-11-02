import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';

import {colors} from '../../theme/colors';
import {TextVariant, typography} from '../../theme/typography';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
}

const colorMap: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  inverse: colors.text.inverse,
  disabled: colors.text.disabled,
  accent: colors.accent,
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
};

export function Text({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      style={[
        typography.variants[variant],
        {color: colorMap[color], textAlign: align},
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
}
