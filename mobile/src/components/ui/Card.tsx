import React from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';

import {colors} from '../../theme/colors';
import {cardShell, cardShellElevated} from '../../theme/surfaces';
import {spacing} from '../../theme/spacing';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  padding?: CardPadding;
  onPress?: () => void;
  elevated?: boolean;
  children: React.ReactNode;
}

const paddingMap: Record<CardPadding, number> = {
  none: 0,
  sm: spacing[3],
  md: spacing[4],
  lg: spacing[5],
};

export function Card({
  padding = 'md',
  onPress,
  elevated = true,
  style,
  children,
  ...rest
}: CardProps) {
  const contentStyle = [
    elevated ? cardShellElevated : cardShell,
    {padding: paddingMap[padding]},
    style,
    // Keep every card on the same surface — callers must not tint card chrome.
    {backgroundColor: colors.surface},
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({pressed}) => [contentStyle, pressed && styles.pressed]}
        {...rest}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={contentStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.94,
    transform: [{scale: 0.99}],
  },
});
