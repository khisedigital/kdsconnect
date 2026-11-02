import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {AdminTabParamList} from '../../../app/navigation/types';
import {Card} from '../../../components/ui/Card';
import {EmptyState} from '../../../components/ui/EmptyState';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import type {
  AdminPendingItem,
  AdminPendingTarget,
} from '../../../types';

type TabNav = BottomTabNavigationProp<AdminTabParamList>;

export function AdminOverviewScreen() {
  const navigation = useNavigation<TabNav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingItems, setPendingItems] = useState<AdminPendingItem[]>([]);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const summary = await getAppApi().admin.getDashboard();
      setPendingItems(summary.pendingItems);
    } catch {
      setPendingItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openPending = (target: AdminPendingTarget) => {
    if (target === 'orders') {
      navigation.navigate('Orders');
    } else if (target === 'quotations') {
      navigation.navigate('Quotations');
    } else if (target === 'support') {
      navigation.getParent()?.navigate('SupportQueries');
    }
  };

  const totalPending = pendingItems.reduce((sum, item) => sum + item.count, 0);

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
          kicker="Follow-up"
          title="Overview"
          description={
            totalPending > 0
              ? `${totalPending} pending items across KYC, orders, and quotations.`
              : 'All clear — nothing pending right now.'
          }
        />

        {loading ? (
          <LoadingState message="Loading pending items…" />
        ) : (
          <FadeIn delay={60}>
            {pendingItems.length === 0 ? (
              <EmptyState
                title="Nothing pending"
                description="KYC, orders, and quotations are clear for now."
              />
            ) : (
              <Card style={styles.pendingCard}>
                {pendingItems.map((item, index) => (
                  <PendingRow
                    key={item.id}
                    item={item}
                    showDivider={index < pendingItems.length - 1}
                    onPress={() => openPending(item.target)}
                  />
                ))}
              </Card>
            )}
          </FadeIn>
        )}
      </ScrollView>
    </Screen>
  );
}

function PendingRow({
  item,
  showDivider,
  onPress,
}: {
  item: AdminPendingItem;
  showDivider: boolean;
  onPress: () => void;
}) {
  const actionable = item.target !== 'none';

  return (
    <Pressable
      accessibilityRole={actionable ? 'button' : undefined}
      disabled={!actionable}
      onPress={onPress}
      style={[styles.pendingRow, showDivider && styles.pendingDivider]}>
      <View
        style={[
          styles.pendingIcon,
          item.tone === 'warning'
            ? styles.pendingIconWarning
            : styles.pendingIconInfo,
        ]}>
        <Icon name={item.icon} color="primary" size={14} />
      </View>
      <View style={styles.flex}>
        <Text variant="body">{item.title}</Text>
        <Text variant="caption" color="secondary">
          {item.detail}
        </Text>
      </View>
      <View style={styles.countPill}>
        <Text variant="label" color="accent">
          {item.count}
        </Text>
      </View>
      {actionable ? (
        <Icon name="chevronRight" color="secondary" size={14} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  scroll: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[4],
  },
  pendingCard: {paddingVertical: spacing[1], paddingHorizontal: 0},
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  pendingDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pendingIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingIconWarning: {backgroundColor: colors.accentSoft},
  pendingIconInfo: {backgroundColor: colors.primarySoft},
  countPill: {
    minWidth: 28,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
  },
  flex: {flex: 1, gap: 2},
});
