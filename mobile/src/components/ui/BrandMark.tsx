import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme/colors';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import {Text} from './Text';

export type BrandMarkSize = 'sm' | 'md' | 'lg' | 'hero';
export type BrandMarkTone = 'inverse' | 'brand';

export interface BrandMarkProps {
  size?: BrandMarkSize;
  tone?: BrandMarkTone;
  showWordmark?: boolean;
  tagline?: string;
  align?: 'center' | 'start';
}

const markSize: Record<BrandMarkSize, number> = {
  sm: 36,
  md: 48,
  lg: 64,
  hero: 88,
};

export function BrandMark({
  size = 'md',
  tone = 'brand',
  showWordmark = true,
  tagline,
  align = 'center',
}: BrandMarkProps) {
  const dim = markSize[size];
  const inverse = tone === 'inverse';
  const start = align === 'start';

  return (
    <View
      style={[styles.wrap, start && styles.wrapStart]}
      accessibilityRole="header">
      <View
        style={[
          styles.mark,
          inverse ? styles.markInverse : styles.markBrand,
          {width: dim, height: dim, borderRadius: dim * 0.28},
        ]}>
        <View
          style={[
            styles.inner,
            inverse ? styles.innerInverse : styles.innerBrand,
          ]}>
          <Text
            variant={size === 'hero' || size === 'lg' ? 'h1' : 'h3'}
            color="inverse"
            style={styles.glyph}>
            K
          </Text>
        </View>
      </View>
      {showWordmark ? (
        <View style={[styles.copy, start && styles.copyStart]}>
          <Text
            variant={size === 'hero' ? 'display' : size === 'lg' ? 'h1' : 'h2'}
            color={inverse ? 'inverse' : 'primary'}
            style={[styles.wordmark, start && styles.textStart]}>
            KDS Connect
          </Text>
          <Text
            variant="caption"
            color={inverse ? 'inverse' : 'secondary'}
            style={[styles.company, start && styles.textStart]}>
            Khise Digital Solution
          </Text>
          {tagline ? (
            <Text
              variant="bodySmall"
              color={inverse ? 'inverse' : 'secondary'}
              style={[styles.tagline, start && styles.textStart]}>
              {tagline}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing[4],
  },
  wrapStart: {
    alignItems: 'flex-start',
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markBrand: {
    backgroundColor: colors.primary,
  },
  markInverse: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  inner: {
    width: '72%',
    height: '72%',
    borderRadius: radii.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBrand: {
    borderColor: colors.brand.light,
  },
  innerInverse: {
    borderColor: colors.text.inverse,
  },
  glyph: {
    marginTop: -2,
  },
  copy: {
    alignItems: 'center',
    gap: spacing[1],
  },
  copyStart: {
    alignItems: 'flex-start',
  },
  wordmark: {
    textAlign: 'center',
  },
  textStart: {
    textAlign: 'left',
  },
  company: {
    opacity: 0.85,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tagline: {
    marginTop: spacing[2],
    textAlign: 'center',
    maxWidth: 280,
    opacity: 0.92,
  },
});
