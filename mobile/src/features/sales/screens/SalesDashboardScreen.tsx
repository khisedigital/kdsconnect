import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {SalesStackParamList} from '../../../app/navigation/types';
import {Card} from '../../../components/ui/Card';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {QuickAction} from '../../../components/ui/QuickAction';
import {Screen} from '../../../components/ui/Screen';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {SalesDashboardSummary} from '../../../types';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<SalesStackParamList>;

export function SalesDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SalesDashboardSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppApi().sales.getDashboard();
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + spacing[2]},
        ]}>
        <TabPageHeader
          kicker="Field sales"
          title="Dashboard"
          description={
            user?.displayName
              ? `Track onboarding for ${user.displayName}.`
              : 'Onboard retailers and wholesalers, then track your numbers.'
          }
        />

        <View style={styles.actions}>
          <QuickAction
            label="Retailer"
            icon="building"
            tone="teal"
            onPress={() => navigation.navigate('OnboardRetailer')}
          />
          <QuickAction
            label="Wholesaler"
            icon="truck"
            tone="copper"
            onPress={() => navigation.navigate('OnboardWholesaler')}
          />
          <QuickAction
            label="Accounts"
            icon="group"
            tone="mist"
            onPress={() =>
              navigation.navigate('SalesTabs', {screen: 'Accounts'})
            }
          />
        </View>

        {loading || !summary ? (
          <LoadingState message="Loading sales metrics…" />
        ) : (
          <FadeIn delay={80}>
            <View style={styles.metrics}>
              <View style={styles.metricCard}>
                <Icon name="building" color="accent" size={18} />
                <Text variant="h2">{summary.retailersOnboarded}</Text>
                <Text variant="caption" color="secondary">
                  Retailers onboarded
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="truck" color="primary" size={18} />
                <Text variant="h2">{summary.wholesalersOnboarded}</Text>
                <Text variant="caption" color="secondary">
                  Wholesalers onboarded
                </Text>
              </View>
            </View>
            <View style={styles.metrics}>
              <View style={styles.metricCard}>
                <Icon name="group" color="primary" size={18} />
                <Text variant="h2">{summary.totalOnboarded}</Text>
                <Text variant="caption" color="secondary">
                  Total onboarded
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="calendar" color="accent" size={18} />
                <Text variant="h2">{summary.onboardedThisWeek}</Text>
                <Text variant="caption" color="secondary">
                  This week
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Icon name="idCard" color="primary" size={18} />
                <Text variant="h2">{summary.pendingKyc}</Text>
                <Text variant="caption" color="secondary">
                  Pending KYC
                </Text>
              </View>
            </View>

            <Card style={styles.tipCard}>
              <Text variant="label">Next step</Text>
              <Text variant="bodySmall" color="secondary" style={styles.tipBody}>
                Use Onboard retailer / wholesaler to create login accounts in
                the field. They will appear in Accounts after submit.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('OnboardRetailer')}>
                <Text variant="label" color="accent">
                  Start retailer onboarding →
                </Text>
              </Pressable>
            </Card>
          </FadeIn>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  scroll: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[4],
  },
  actions: {flexDirection: 'row', gap: spacing[2]},
  metrics: {flexDirection: 'row', gap: spacing[3]},
  metricCard: {
    ...cardShellElevated,
    flex: 1,
    padding: spacing[4],
    gap: spacing[1],
  },
  tipCard: {gap: spacing[2]},
  tipBody: {lineHeight: 20},
});
