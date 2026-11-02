import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, StyleSheet, View} from 'react-native';

import type {AuthStackParamList} from '../../../app/navigation/types';
import {Atmosphere} from '../../../components/ui/Atmosphere';
import {BrandMark} from '../../../components/ui/BrandMark';
import {Text} from '../../../components/ui/Text';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {useAuth} from '../AuthContext';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const {status, onboardingCompleted, isBootstrapping} = useAuth();
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    if (isBootstrapping || status === 'unknown') {
      return;
    }
    const timer = setTimeout(() => {
      if (status === 'authenticated') {
        return;
      }
      if (!onboardingCompleted) {
        navigation.replace('Onboarding');
        return;
      }
      navigation.replace('SignIn');
    }, 1600);
    return () => clearTimeout(timer);
  }, [isBootstrapping, navigation, onboardingCompleted, status]);

  return (
    <Atmosphere variant="deep" style={styles.root}>
      <View style={styles.content}>
        <Animated.View style={{opacity: pulse}}>
          <BrandMark
            size="hero"
            tone="inverse"
            tagline="Wholesale purchasing, simplified"
          />
        </Animated.View>
        <View style={styles.footer}>
          <ActivityIndicator color={colors.accentBright} size="small" />
          <Text variant="caption" color="inverse" style={styles.loading}>
            Preparing your workspace
          </Text>
        </View>
      </View>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    gap: spacing[12],
  },
  footer: {
    alignItems: 'center',
    gap: spacing[3],
  },
  loading: {
    opacity: 0.75,
    letterSpacing: 0.6,
  },
});
