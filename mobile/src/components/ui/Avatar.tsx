import React, {useMemo} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {Text} from './Text';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name?: string;
  source?: ImageSourcePropType;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function Avatar({name = '', source, size = 'md'}: AvatarProps) {
  const dimension = sizeMap[size];
  const initials = useMemo(() => getInitials(name), [name]);

  if (source) {
    return (
      <Image
        accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
        source={source}
        style={[
          styles.base,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
      style={[
        styles.base,
        styles.fallback,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
      ]}>
      <Text
        variant={size === 'lg' ? 'body' : 'caption'}
        color="inverse"
        align="center">
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
