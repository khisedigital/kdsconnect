import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {BrandMark} from '../../../components/ui/BrandMark';
import {Card} from '../../../components/ui/Card';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RegisterRole'>;

export function RegisterRoleScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Screen scroll backgroundColor={colors.background} contentContainerStyle={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.back}>
          <Icon name="chevronLeft" />
          <Text variant="label">Back</Text>
        </Pressable>
        <BrandMark size="sm" showWordmark={false} />
      </View>

      <FadeIn>
        <Text variant="h1">Join KDS Connect</Text>
        <Text variant="body" color="secondary" style={styles.intro}>
          Choose the experience that matches how your business buys or sells wholesale.
        </Text>
      </FadeIn>

      <FadeIn delay={100}>
        <View style={styles.cards}>
          <Card
            padding="lg"
            onPress={() => navigation.navigate('RegisterRetailer')}
            style={[styles.roleCard, elevation[2]]}>
            <View style={styles.cardAccent} />
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, styles.retailerIcon]}>
                <Icon name="cart" color="inverse" size={22} />
              </View>
              <Text variant="h2">Retailer</Text>
            </View>
            <Text variant="bodySmall" color="secondary" style={styles.cardBody}>
              Source products, request quotes, join group buys, and place wholesale orders.
            </Text>
            <Text variant="label" color="accent">
              Continue as retailer →
            </Text>
          </Card>

          <Card
            padding="lg"
            onPress={() => navigation.navigate('RegisterSupplier')}
            style={[styles.roleCard, elevation[2]]}>
            <View style={[styles.cardAccent, styles.cardAccentCopper]} />
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, styles.supplierIcon]}>
                <Icon name="package" color="inverse" size={22} />
              </View>
              <Text variant="h2">Supplier</Text>
            </View>
            <Text variant="bodySmall" color="secondary" style={styles.cardBody}>
              Publish catalogues, respond to RFQs, and fulfil orders from retail partners.
            </Text>
            <Text variant="label" color="accent">
              Continue as supplier →
            </Text>
          </Card>
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[5],
    paddingBottom: spacing[10],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
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
  intro: {
    marginTop: spacing[2],
    maxWidth: 340,
  },
  cards: {
    gap: spacing[4],
  },
  roleCard: {
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.primary,
  },
  cardAccentCopper: {
    backgroundColor: colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retailerIcon: {
    backgroundColor: colors.primary,
  },
  supplierIcon: {
    backgroundColor: colors.accent,
  },
  cardBody: {
    marginBottom: spacing[4],
    lineHeight: 22,
  },
});
