import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {IconName} from '../../theme/icons';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {cardShellElevated} from '../../theme/surfaces';
import {Icon} from './Icon';
import {Text} from './Text';

export interface QuickActionProps {
  label: string;
  icon: IconName;
  onPress: () => void;
  tone?: 'teal' | 'copper' | 'mist';
}

const toneStyles = {
  teal: {
    bg: colors.primarySoft,
    icon: 'primary' as const,
  },
  copper: {
    bg: colors.accentSoft,
    icon: 'accent' as const,
  },
  mist: {
    bg: colors.surface,
    icon: 'secondary' as const,
  },
};

export function QuickAction({
  label,
  icon,
  onPress,
  tone = 'teal',
}: QuickActionProps) {
  const palette = toneStyles[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({pressed}) => [
        styles.action,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconWrap, {backgroundColor: palette.bg}]}>
        <Icon name={icon} color={palette.icon} size={20} />
      </View>
      <Text variant="caption" align="center" numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    ...cardShellElevated,
    flex: 1,
    minWidth: 72,
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.98}],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
