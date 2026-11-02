import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {colors} from '../../theme/colors';

export type AtmosphereVariant = 'deep' | 'mist' | 'auth';

export interface AtmosphereProps {
  variant?: AtmosphereVariant;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Layered color fields that read as atmosphere without a gradient library.
 */
export function Atmosphere({
  variant = 'mist',
  style,
  children,
}: AtmosphereProps) {
  if (variant === 'deep') {
    return (
      <View style={[styles.deepRoot, style]}>
        <View style={styles.deepOrbTop} />
        <View style={styles.deepOrbBottom} />
        <View style={styles.deepBand} />
        {children}
      </View>
    );
  }

  if (variant === 'auth') {
    return (
      <View style={[styles.authRoot, style]}>
        <View style={styles.authHero} />
        <View style={styles.authOrb} />
        <View style={styles.authWash} />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.mistRoot, style]}>
      <View style={styles.mistOrb} />
      <View style={styles.mistBand} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  deepRoot: {
    flex: 1,
    backgroundColor: colors.brand.deep,
    overflow: 'hidden',
  },
  deepOrbTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.brand.light,
    opacity: 0.28,
  },
  deepOrbBottom: {
    position: 'absolute',
    bottom: -40,
    left: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primaryMuted,
    opacity: 0.35,
  },
  deepBand: {
    position: 'absolute',
    top: '42%',
    left: -20,
    right: -20,
    height: 120,
    backgroundColor: colors.brand.glow,
    transform: [{rotate: '-8deg'}],
  },
  authRoot: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  authHero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: colors.primary,
  },
  authOrb: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  authWash: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  mistRoot: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  mistOrb: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.brand.wash,
    opacity: 0.9,
  },
  mistBand: {
    position: 'absolute',
    top: 120,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accentSoft,
    opacity: 0.45,
  },
});
