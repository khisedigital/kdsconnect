import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {BrandMark} from '../../../components/ui/BrandMark';
import {Button} from '../../../components/ui/Button';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {colors} from '../../../theme/colors';
import type {IconName} from '../../../theme/icons';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tone: 'teal' | 'copper' | 'deep';
}

const SLIDES: Slide[] = [
  {
    id: 'discover',
    title: 'Discover wholesale products',
    description:
      'Browse verified supplier catalogues with MOQ, packaging, and landed pricing built for retailers.',
    icon: 'products',
    tone: 'teal',
  },
  {
    id: 'quotations',
    title: 'Request & compare quotations',
    description:
      'Send RFQs once, compare item prices, tax, and delivery side by side, then accept with confidence.',
    icon: 'quote',
    tone: 'deep',
  },
  {
    id: 'group',
    title: 'Group buying & orders',
    description:
      'Join volume campaigns, track participation progress, and manage fulfilment from one place.',
    icon: 'group',
    tone: 'copper',
  },
];

const toneFill = {
  teal: colors.primary,
  deep: colors.brand.deep,
  copper: colors.accent,
};

export function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const {completeOnboarding} = useAuth();
  const {width} = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const slideWidth = width - spacing.screenPaddingHorizontal * 2;

  const finish = useCallback(async () => {
    await completeOnboarding();
    navigation.replace('SignIn');
  }, [completeOnboarding, navigation]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      if (next !== index && next >= 0 && next < SLIDES.length) {
        setIndex(next);
      }
    },
    [index, slideWidth],
  );

  const goNext = useCallback(() => {
    if (index >= SLIDES.length - 1) {
      void finish();
      return;
    }
    listRef.current?.scrollToIndex({index: index + 1, animated: true});
  }, [finish, index]);

  return (
    <Screen
      edges={['top', 'bottom']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.screenContent}>
      <View style={styles.topRow}>
        <BrandMark size="sm" showWordmark={false} />
        <Pressable
          accessibilityRole="button"
          onPress={() => void finish()}
          hitSlop={8}
          style={styles.skip}>
          <Text variant="label" color="secondary">
            Skip
          </Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={onScroll}
        getItemLayout={(_, i) => ({
          length: slideWidth,
          offset: slideWidth * i,
          index: i,
        })}
        renderItem={({item}) => (
          <View style={[styles.slide, {width: slideWidth}]}>
            <FadeIn>
              <View
                style={[
                  styles.illustration,
                  {backgroundColor: toneFill[item.tone]},
                ]}>
                <View style={styles.illustrationOrb} />
                <View style={styles.iconBadge}>
                  <Icon name={item.icon} color="inverse" size={36} />
                </View>
                <Text variant="caption" color="inverse" style={styles.kicker}>
                  KDS Wholesale
                </Text>
              </View>
            </FadeIn>
            <Text variant="h1" style={styles.slideTitle}>
              {item.title}
            </Text>
            <Text variant="body" color="secondary" style={styles.slideBody}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((slide, dotIndex) => (
          <View
            key={slide.id}
            style={[styles.dot, dotIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      <Button
        title={index === SLIDES.length - 1 ? 'Get started' : 'Continue'}
        size="lg"
        fullWidth
        onPress={goNext}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slide: {
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  illustration: {
    height: 260,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
    overflow: 'hidden',
  },
  illustrationOrb: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  iconBadge: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  kicker: {
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  slideTitle: {
    maxWidth: 320,
  },
  slideBody: {
    maxWidth: 340,
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginVertical: spacing[5],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 28,
  },
});
