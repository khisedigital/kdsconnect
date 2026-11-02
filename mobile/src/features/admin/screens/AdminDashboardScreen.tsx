import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {AdminTabParamList} from '../../../app/navigation/types';
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
import {elevation} from '../../../theme/elevation';
import type {IconName} from '../../../theme/icons';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {AdminDashboardSummary} from '../../../types';
import {greetingForTime} from '../../../utils/format';
import {useAuth} from '../../auth/AuthContext';

type TabNav = BottomTabNavigationProp<AdminTabParamList>;

const SECTION_GAP = spacing[4];
const CARD_GAP = spacing[3];

export function AdminDashboardScreen() {
  const navigation = useNavigation<TabNav>();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      setSummary(await getAppApi().admin.getDashboard());
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const firstName =
    user?.displayName?.split(' ')[0] ?? user?.businessName ?? 'Admin';

  const pendingTotal = useMemo(
    () => summary?.pendingItems.reduce((sum, item) => sum + item.count, 0) ?? 0,
    [summary],
  );

  const networkTotal = useMemo(() => {
    if (!summary) {
      return 0;
    }
    return (
      summary.totalRetailers +
      summary.totalWholesalers +
      summary.totalSalesReps
    );
  }, [summary]);

  // Exact half-width tiles so 2-column grids don't wrap unevenly.
  const halfCardWidth =
    (width - spacing.screenPaddingHorizontal * 2 - CARD_GAP) / 2;

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load(true)}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + spacing[2]},
        ]}>
        <TabPageHeader
          kicker={greetingForTime()}
          title="Dashboard"
          description={`${firstName}, platform numbers at a glance. Pending work lives in Overview.`}
          style={styles.pageHeader}
        />

        {loading || !summary ? (
          <LoadingState message="Loading dashboard…" />
        ) : (
          <FadeIn delay={50} style={styles.stack}>
            <View style={[styles.hero, elevation[2]]}>
              <View style={styles.heroOrb} />
              <Text variant="caption" color="inverse" style={styles.heroKicker}>
                Platform pulse
              </Text>
              <Text variant="h1" color="inverse">
                {networkTotal.toLocaleString('en-IN')}
              </Text>
              <Text variant="bodySmall" color="inverse" style={styles.heroLead}>
                Active accounts across retailers, wholesalers, and sales.
              </Text>
              <View style={styles.heroSplit}>
                <HeroStat
                  label="Live orders"
                  value={summary.activeOrders}
                  onPress={() => navigation.navigate('Orders')}
                />
                <View style={styles.heroDivider} />
                <HeroStat
                  label="Open RFQs"
                  value={summary.requestedQuotations}
                  onPress={() => navigation.navigate('Quotations')}
                />
                <View style={styles.heroDivider} />
                <HeroStat
                  label="Pending"
                  value={pendingTotal}
                  onPress={() => navigation.navigate('Overview')}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <QuickAction
                label="Orders"
                icon="orders"
                tone="teal"
                onPress={() => navigation.navigate('Orders')}
              />
              <QuickAction
                label="Quotations"
                icon="quote"
                tone="copper"
                onPress={() => navigation.navigate('Quotations')}
              />
              <QuickAction
                label="Overview"
                icon="alert"
                tone="mist"
                onPress={() => navigation.navigate('Overview')}
              />
            </View>

            <View style={styles.section}>
              <SectionTitle
                title="Live commerce"
                subtitle="Tap a card to open the working list"
              />
              <View style={styles.row}>
                <LiveMetric
                  width={halfCardWidth}
                  icon="orders"
                  value={summary.activeOrders}
                  label="Active orders"
                  hint="In progress now"
                  tone="teal"
                  onPress={() => navigation.navigate('Orders')}
                />
                <LiveMetric
                  width={halfCardWidth}
                  icon="quote"
                  value={summary.requestedQuotations}
                  label="Open quotations"
                  hint="Awaiting quotes"
                  tone="copper"
                  onPress={() => navigation.navigate('Quotations')}
                />
              </View>
            </View>

            <View style={styles.section}>
              <SectionTitle
                title="Network analysis"
                subtitle="Who is on the platform"
              />
              <View style={styles.rowWrap}>
                <NetworkMetric
                  width={halfCardWidth}
                  icon="building"
                  value={summary.totalRetailers}
                  label="Retailers"
                />
                <NetworkMetric
                  width={halfCardWidth}
                  icon="truck"
                  value={summary.totalWholesalers}
                  label="Wholesalers"
                />
                <NetworkMetric
                  width={halfCardWidth}
                  icon="group"
                  value={summary.totalSalesReps}
                  label="Sales reps"
                />
                <NetworkMetric
                  width={halfCardWidth}
                  icon="calendar"
                  value={summary.onboardedThisMonth}
                  label="Onboarded this month"
                />
              </View>
            </View>

            <Card
              onPress={() => navigation.navigate('Overview')}
              style={styles.pendingCard}>
              <View
                style={[
                  styles.pendingIcon,
                  pendingTotal > 0
                    ? styles.pendingIconWarn
                    : styles.pendingIconOk,
                ]}>
                <Icon
                  name={pendingTotal > 0 ? 'alert' : 'check'}
                  color={pendingTotal > 0 ? 'accent' : 'primary'}
                  size={18}
                />
              </View>
              <View style={styles.pendingCopy}>
                <Text variant="label">
                  {pendingTotal > 0
                    ? `${pendingTotal} items need attention`
                    : 'Nothing pending'}
                </Text>
                <Text variant="caption" color="secondary">
                  {pendingTotal > 0
                    ? 'KYC, orders, quotations, and support queries'
                    : 'Overview is clear — check back later'}
                </Text>
              </View>
              <Icon name="chevronRight" color="secondary" size={14} />
            </Card>
          </FadeIn>
        )}
      </ScrollView>
    </Screen>
  );
}

function SectionTitle({title, subtitle}: {title: string; subtitle: string}) {
  return (
    <View style={styles.sectionHead}>
      <Text variant="h3">{title}</Text>
      <Text variant="caption" color="secondary">
        {subtitle}
      </Text>
    </View>
  );
}

function HeroStat({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.heroStat, pressed && styles.pressed]}>
      <Text variant="h3" color="inverse">
        {value}
      </Text>
      <Text
        variant="caption"
        color="inverse"
        numberOfLines={1}
        style={styles.heroStatLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function LiveMetric({
  width,
  icon,
  value,
  label,
  hint,
  tone,
  onPress,
}: {
  width: number;
  icon: IconName;
  value: number;
  label: string;
  hint: string;
  tone: 'teal' | 'copper';
  onPress: () => void;
}) {
  const soft = tone === 'teal' ? colors.primarySoft : colors.accentSoft;
  const iconColor = tone === 'teal' ? 'primary' : 'accent';

  return (
    <Card onPress={onPress} style={[styles.metricCard, {width}]}>
      <View style={[styles.metricIcon, {backgroundColor: soft}]}>
        <Icon name={icon} color={iconColor} size={18} />
      </View>
      <Text variant="h2">{value}</Text>
      <Text variant="label" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="caption" color="secondary" numberOfLines={1}>
        {hint}
      </Text>
    </Card>
  );
}

function NetworkMetric({
  width,
  icon,
  value,
  label,
}: {
  width: number;
  icon: IconName;
  value: number;
  label: string;
}) {
  return (
    <Card style={[styles.metricCard, {width}]}>
      <Icon name={icon} color="primary" size={16} />
      <Text variant="h3">{value.toLocaleString('en-IN')}</Text>
      <Text variant="caption" color="secondary" numberOfLines={2}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  scroll: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: SECTION_GAP,
  },
  pageHeader: {
    marginBottom: 0,
    gap: spacing[2],
  },
  stack: {
    gap: SECTION_GAP,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing[5],
    overflow: 'hidden',
    gap: spacing[2],
  },
  heroOrb: {
    position: 'absolute',
    top: -48,
    right: -28,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  heroKicker: {
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroLead: {opacity: 0.9, maxWidth: 280, lineHeight: 20},
  heroSplit: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing[2],
    paddingTop: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.22)',
    gap: spacing[2],
  },
  heroStat: {flex: 1, gap: spacing[1], minWidth: 0},
  heroStatLabel: {opacity: 0.85},
  heroDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  actions: {flexDirection: 'row', gap: CARD_GAP},
  section: {gap: spacing[3]},
  sectionHead: {gap: spacing[1]},
  row: {flexDirection: 'row', gap: CARD_GAP},
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  metricCard: {
    gap: spacing[1],
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingIconWarn: {backgroundColor: colors.accentSoft},
  pendingIconOk: {backgroundColor: colors.primarySoft},
  pendingCopy: {flex: 1, gap: 2, minWidth: 0},
  pressed: {opacity: 0.88},
});
