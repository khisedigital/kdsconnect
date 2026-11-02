import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showValues?: boolean;
}

export function ProgressBar({
  current,
  target,
  label,
  showValues = true,
}: ProgressBarProps) {
  const ratio = useMemo(() => {
    if (target <= 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, current / target));
  }, [current, target]);

  const percent = Math.round(ratio * 100);

  return (
    <View style={styles.wrapper}>
      {(label || showValues) && (
        <View style={styles.header}>
          {label ? (
            <Text variant="bodySmall" color="secondary">
              {label}
            </Text>
          ) : (
            <View />
          )}
          {showValues ? (
            <Text variant="caption" color="secondary">
              {current} / {target} ({percent}%)
            </Text>
          ) : null}
        </View>
      )}
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{min: 0, max: target, now: current}}>
        <View style={[styles.fill, {width: `${percent}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  track: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
});
