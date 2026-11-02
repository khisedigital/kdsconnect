import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {cardShellElevated} from '../../theme/surfaces';
import {Button} from './Button';
import {Text} from './Text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({title, description, action}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <View style={styles.orb} />
      <Text variant="h3" align="center">
        {title}
      </Text>
      {description ? (
        <Text
          variant="bodySmall"
          color="secondary"
          align="center"
          style={styles.description}>
          {description}
        </Text>
      ) : null}
      {action ? (
        <Button
          title={action.label}
          variant="secondary"
          size="sm"
          onPress={action.onPress}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...cardShellElevated,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  orb: {
    position: 'absolute',
    top: -28,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
  },
  description: {
    marginTop: spacing[2],
    maxWidth: 300,
  },
  action: {
    marginTop: spacing[4],
  },
});
