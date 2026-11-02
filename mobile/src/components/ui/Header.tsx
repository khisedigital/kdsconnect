import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Header({title, subtitle, left, right}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{left}</View>
      <View style={styles.center}>
        <Text variant="h3" numberOfLines={1} align="center">
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="caption"
            color="secondary"
            numberOfLines={1}
            align="center"
            style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  side: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    marginTop: 2,
  },
});
