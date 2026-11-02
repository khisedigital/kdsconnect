import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {Icon} from './Icon';
import {Text} from './Text';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  disabled?: boolean;
}

export function ListRow({
  title,
  subtitle,
  left,
  right,
  onPress,
  showChevron = Boolean(onPress),
  disabled = false,
}: ListRowProps) {
  const content = (
    <>
      {left ? <View style={styles.left}>{left}</View> : null}
      <View style={styles.body}>
        <Text variant="body" color={disabled ? 'disabled' : 'primary'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodySmall"
            color={disabled ? 'disabled' : 'secondary'}
            numberOfLines={2}
            style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
      {showChevron && onPress ? (
        <Icon name="chevronRight" color="secondary" size={20} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({pressed}) => [
          styles.row,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    minHeight: 56,
    backgroundColor: colors.surface,
  },
  left: {
    marginRight: spacing[3],
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    marginTop: spacing[1] / 2,
  },
  right: {
    marginLeft: spacing[2],
    marginRight: spacing[1],
  },
  pressed: {
    backgroundColor: colors.background,
  },
  disabled: {
    opacity: 0.6,
  },
});
