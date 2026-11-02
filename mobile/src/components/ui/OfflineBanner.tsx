import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({
  message = 'You are offline. Some features may be unavailable.',
}: OfflineBannerProps) {
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text variant="bodySmall" color="inverse" align="center">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.semantic.warning,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
});
