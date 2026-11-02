import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Badge} from '../../../components/ui/Badge';
import {Chip} from '../../../components/ui/Chip';
import {EmptyState} from '../../../components/ui/EmptyState';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {OnboardedAccount, OnboardedAccountKind} from '../../../types';
import {formatDate} from '../../../utils/format';

type FilterKey = 'all' | OnboardedAccountKind;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'retailer', label: 'Retailers'},
  {key: 'supplier', label: 'Wholesalers'},
];

function statusVariant(
  status: OnboardedAccount['status'],
): 'success' | 'warning' | 'info' | 'neutral' {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending_kyc':
      return 'warning';
    case 'invited':
      return 'info';
    default:
      return 'neutral';
  }
}

export function SalesAccountsListScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<OnboardedAccount[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getAppApi().sales.listOnboardedAccounts();
      setAccounts(items);
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return accounts;
    }
    return accounts.filter(item => item.kind === filter);
  }, [accounts, filter]);

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          {paddingTop: insets.top + spacing[2]},
        ]}
        ListHeaderComponent={
          <TabPageHeader
            kicker="Your pipeline"
            title="Accounts"
            description="Retailers and wholesalers you have onboarded.">
            <View style={styles.filters}>
              {FILTERS.map(item => (
                <Chip
                  key={item.key}
                  label={item.label}
                  selected={filter === item.key}
                  onPress={() => setFilter(item.key)}
                />
              ))}
            </View>
          </TabPageHeader>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Loading accounts…" />
          ) : (
            <EmptyState
              title="No accounts yet"
              description="Onboard a retailer or wholesaler from the Dashboard."
            />
          )
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconBubble}>
                <Icon
                  name={item.kind === 'retailer' ? 'building' : 'truck'}
                  color="primary"
                  size={16}
                />
              </View>
              <View style={styles.flex}>
                <Text variant="h3">{item.businessName}</Text>
                <Text variant="caption" color="secondary">
                  {item.displayName} · {item.email}
                </Text>
                {item.city ? (
                  <Text variant="caption" color="tertiary">
                    {item.city}
                  </Text>
                ) : null}
              </View>
              <Badge
                label={item.kind === 'supplier' ? 'wholesaler' : item.kind}
                variant="neutral"
              />
            </View>
            <View style={styles.footer}>
              <Text variant="caption" color="secondary">
                Onboarded {formatDate(item.onboardedAt)}
              </Text>
              <Badge label={item.status} variant={statusVariant(item.status)} />
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[3],
  },
  filters: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2]},
  card: {
    ...cardShellElevated,
    padding: spacing[4],
    gap: spacing[3],
  },
  row: {flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start'},
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
