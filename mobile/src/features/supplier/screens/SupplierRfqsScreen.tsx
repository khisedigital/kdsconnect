import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {Badge} from '../../../components/ui/Badge';
import {Chip} from '../../../components/ui/Chip';
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
import {cardShellElevated} from '../../../theme/surfaces';
import type {Rfq, RfqStatus} from '../../../types';
import {formatDate} from '../../../utils/format';

type Nav = NativeStackNavigationProp<SupplierStackParamList>;
type FilterKey = 'all' | RfqStatus;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'submitted', label: 'To quote'},
  {key: 'quoted', label: 'Quoted'},
  {key: 'awarded', label: 'Awarded'},
  {key: 'cancelled', label: 'Cancelled'},
];

function statusVariant(
  status: RfqStatus,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'awarded':
      return 'success';
    case 'quoted':
      return 'info';
    case 'submitted':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function SupplierRfqsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().rfqs.listRfqs(1, 40);
      setRfqs(result.items);
    } catch {
      setRfqs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return rfqs;
    }
    return rfqs.filter(item => item.status === filter);
  }, [filter, rfqs]);

  const toQuote = rfqs.filter(item => item.status === 'submitted').length;

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
            kicker="Quotations"
            title="RFQs"
            description="Review retailer requests and submit competitive wholesale quotations.">
            <FadeIn delay={80}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Icon name="quote" color="accent" size={18} />
                  <Text variant="h2">{rfqs.length}</Text>
                  <Text variant="caption" color="secondary">
                    Inbox
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="clock" color="primary" size={18} />
                  <Text variant="h2">{toQuote}</Text>
                  <Text variant="caption" color="secondary">
                    Awaiting your quote
                  </Text>
                </View>
              </View>
            </FadeIn>
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
            <LoadingState message="Loading RFQs…" />
          ) : (
            <EmptyState
              title="No RFQs in queue"
              description={
                filter === 'all'
                  ? 'Incoming retailer quotation requests will appear here for you to respond.'
                  : 'No RFQs match this filter.'
              }
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('SupplierRfqDetails', {rfqId: item.id})
            }
            style={({pressed}) => [styles.rfqCard, pressed && styles.pressed]}>
            <View style={styles.cardTop}>
              <View style={styles.iconBubble}>
                <Icon name="quote" color="primary" size={16} />
              </View>
              <View style={styles.flex}>
                <Text variant="h3" numberOfLines={2}>
                  {item.title}
                </Text>
                <Text variant="caption" color="secondary">
                  Received {formatDate(item.createdAt)}
                </Text>
              </View>
              <Badge label={item.status} variant={statusVariant(item.status)} />
            </View>
            <View style={styles.divider} />
            <View style={styles.footerRow}>
              <Text variant="bodySmall" color="secondary">
                {item.items.length} line
                {item.items.length === 1 ? '' : 's'} ·{' '}
                {item.status === 'submitted' ? 'Submit quotation' : 'View details'}
              </Text>
              <Icon name="chevronRight" color="secondary" size={14} />
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    ...cardShellElevated,
    flex: 1,
    padding: spacing[4],
    gap: spacing[1],
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  rfqCard: {
    ...cardShellElevated,
    padding: spacing[4],
    gap: spacing[3],
  },
  pressed: {opacity: 0.94},
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
