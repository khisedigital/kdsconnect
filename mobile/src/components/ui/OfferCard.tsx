import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {elevation} from '../../theme/elevation';
import {spacing} from '../../theme/spacing';
import {cardShellElevated} from '../../theme/surfaces';
import {Badge} from './Badge';
import {Text} from './Text';

export interface OfferCardProps {
  title: string;
  subtitle?: string;
  priceLabel: string;
  meta?: string;
  badge?: string;
  onPress?: () => void;
  /** Fixed rail width for horizontal carousels; omit for fluid grid cells. */
  railWidth?: number;
}

export function OfferCard({
  title,
  subtitle,
  priceLabel,
  meta,
  badge,
  onPress,
  railWidth,
}: OfferCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [
        cardShellElevated,
        railWidth != null ? {width: railWidth, marginRight: spacing[3]} : styles.fluid,
        elevation[2],
        pressed && styles.pressed,
      ]}>
      <View style={styles.media}>
        <View style={styles.mediaOrb} />
        <Text variant="caption" color="inverse" style={styles.mediaLabel}>
          Wholesale
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text variant="h3" numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {badge ? <Badge label={badge} variant="success" /> : null}
        </View>
        {subtitle ? (
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text variant="h3" color="accent">
            {priceLabel}
          </Text>
          {meta ? (
            <Text variant="caption" color="secondary">
              {meta}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fluid: {
    width: '100%',
  },
  pressed: {
    opacity: 0.94,
    transform: [{scale: 0.985}],
  },
  media: {
    height: 96,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    padding: spacing[3],
    overflow: 'hidden',
  },
  mediaOrb: {
    position: 'absolute',
    top: -24,
    right: -18,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  mediaLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  body: {
    padding: spacing[3],
    gap: spacing[1],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  title: {
    flex: 1,
  },
  footer: {
    marginTop: spacing[2],
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
});
