import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Button} from './Button';
import {Icon} from './Icon';
import {Text} from './Text';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert" color="primary" size={28} />
      </View>
      <Text variant="h3" align="center">
        {title}
      </Text>
      <Text variant="bodySmall" color="secondary" align="center" style={styles.description}>
        {description}
      </Text>
      {onRetry ? (
        <Button
          title={retryLabel}
          variant="secondary"
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.statusBadge.error.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  description: {
    marginTop: spacing[2],
    maxWidth: 320,
  },
  button: {
    marginTop: spacing[5],
    minWidth: 160,
  },
});
