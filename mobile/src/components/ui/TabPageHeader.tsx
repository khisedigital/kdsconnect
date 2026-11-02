import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {spacing} from '../../theme/spacing';
import {FadeIn} from './FadeIn';
import {Text} from './Text';

export interface TabPageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Shared tab-root page chrome (kicker + title + lead).
 * Role screens supply their own copy and children (stats, filters, actions).
 */
export function TabPageHeader({
  kicker,
  title,
  description,
  style,
  children,
}: TabPageHeaderProps) {
  return (
    <View style={[styles.wrap, style]}>
      <FadeIn style={styles.titleStack}>
        <Text variant="caption" color="secondary" style={styles.kicker}>
          {kicker}
        </Text>
        <Text variant="h1">{title}</Text>
        {description ? (
          <Text variant="bodySmall" color="secondary" style={styles.lead}>
            {description}
          </Text>
        ) : null}
      </FadeIn>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing[3],
  },
  titleStack: {
    gap: spacing[1],
  },
  kicker: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  lead: {
    maxWidth: 340,
  },
});
