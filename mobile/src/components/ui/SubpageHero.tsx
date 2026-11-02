import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import type {IconName} from '../../theme/icons';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Icon} from './Icon';
import {Text} from './Text';

export interface SubpageHeroProps {
  kicker?: string;
  title: string;
  description?: string;
  icon?: IconName;
  onBack: () => void;
  tone?: 'teal' | 'copper' | 'deep';
}

const toneFill = {
  teal: colors.primary,
  copper: colors.accent,
  deep: colors.brand.deep,
} as const;

export function SubpageHero({
  kicker,
  title,
  description,
  icon = 'account',
  onBack,
  tone = 'teal',
}: SubpageHeroProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={8}
        style={({pressed}) => [styles.back, pressed && styles.pressed]}>
        <Icon name="chevronLeft" size={16} />
        <Text variant="label">Back</Text>
      </Pressable>

      <View style={[styles.hero, elevation[2], {backgroundColor: toneFill[tone]}]}>
        <View style={styles.orb} />
        <View style={styles.iconBadge}>
          <Icon name={icon} color="inverse" size={22} />
        </View>
        {kicker ? (
          <Text variant="caption" color="inverse" style={styles.kicker}>
            {kicker}
          </Text>
        ) : null}
        <Text variant="h1" color="inverse">
          {title}
        </Text>
        {description ? (
          <Text variant="bodySmall" color="inverse" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing[4],
    marginBottom: spacing[2],
  },
  back: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
  },
  hero: {
    borderRadius: 24,
    padding: spacing[5],
    overflow: 'hidden',
    gap: spacing[2],
  },
  orb: {
    position: 'absolute',
    top: -36,
    right: -24,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  kicker: {
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  description: {
    opacity: 0.9,
    maxWidth: 320,
  },
});
