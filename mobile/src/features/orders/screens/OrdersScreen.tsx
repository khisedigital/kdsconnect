import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {Badge} from '../../../components/ui/Badge';
import {Chip} from '../../../components/ui/Chip';
import {EmptyState} from '../../../components/ui/EmptyState';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import type {IconName} from '../../../theme/icons';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {Order, OrderStatus} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Nav = NativeStackNavigationProp<RetailerStackParamList>;

type FilterKey = 'all' | OrderStatus;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'pending', label: 'Pending'},
  {key: 'processing', label: 'Processing'},
  {key: 'shipped', label: 'Shipped'},
  {key: 'delivered', label: 'Delivered'},
];

function statusVariant(
  status: OrderStatus,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'shipped':
      return 'info';
    case 'processing':
    case 'confirmed':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'neutral';
  }
}

function statusIcon(status: OrderStatus): IconName {
  switch (status) {
    case 'shipped':
      return 'truck';
    case 'delivered':
      return 'check';
    case 'cancelled':
      return 'close';
    case 'processing':
    case 'confirmed':
      return 'package';
    default:
      return 'clock';
  }
}

function statusAccent(status: OrderStatus): string {
  switch (status) {
    case 'delivered':
      return colors.semantic.success;
    case 'shipped':
      return colors.semantic.info;
    case 'cancelled':
      return colors.semantic.error;
    case 'processing':
    case 'confirmed':
      return colors.accent;
    default:
      return colors.primaryMuted;
  }
}

export function OrdersScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().orders.listOrders(1, 40);
      setOrders(result.items);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return orders;
    }
    return orders.filter(o => o.status === filter);
  }, [filter, orders]);

  const inFlight = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled',
  ).length;

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
          <View style={styles.headerBlock}>
            <FadeIn>
              <Text variant="caption" color="secondary" style={styles.kicker}>
                Fulfilment
              </Text>
              <Text variant="h1">Orders</Text>
              <Text variant="bodySmall" color="secondary" style={styles.lead}>
                Track wholesale purchases from confirmation through delivery.
              </Text>
            </FadeIn>

            <FadeIn delay={80}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Icon name="orders" color="accent" size={18} />
                  <Text variant="h2">{orders.length}</Text>
                  <Text variant="caption" color="secondary">
                    Total orders
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="truck" color="primary" size={18} />
                  <Text variant="h2">{inFlight}</Text>
                  <Text variant="caption" color="secondary">
                    In progress
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
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Loading orders…" />
          ) : (
            <EmptyState
              title="No orders found"
              description={
                filter === 'all'
                  ? 'Confirmed wholesale purchases will appear here with status and totals.'
                  : 'No orders match this status filter.'
              }
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('OrderDetails', {orderId: item.id})
            }
            style={({pressed}) => [
              styles.orderCard,
              pressed && styles.pressed,
            ]}>
            <View
              style={[
                styles.statusRail,
                {backgroundColor: statusAccent(item.status)},
              ]}
            />
            <View style={styles.orderBody}>
              <View style={styles.orderTop}>
                <View style={styles.iconBubble}>
                  <Icon
                    name={statusIcon(item.status)}
                    color="primary"
                    size={16}
                  />
                </View>
                <View style={styles.flex}>
                  <Text variant="h3">Order #{item.id.slice(-8)}</Text>
                  <Text variant="caption" color="secondary">
                    Placed {formatDate(item.createdAt)}
                  </Text>
                </View>
                <Badge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.orderMeta}>
                <View>
                  <Text variant="caption" color="secondary">
                    {item.items.length} item{item.items.length === 1 ? '' : 's'}
                  </Text>
                  <Text variant="bodySmall" numberOfLines={1}>
                    {item.items.map(line => line.productName).join(', ') ||
                      'Line items pending'}
                  </Text>
                </View>
                <View style={styles.totalBlock}>
                  <Text variant="caption" color="secondary">
                    Total
                  </Text>
                  <Text variant="h3" color="accent">
                    {formatMoney(item.total)}
                  </Text>
                </View>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.metaItem}>
                  <Icon name="truck" color="secondary" size={13} />
                  <Text variant="caption" color="secondary">
                    {item.shipping
                      ? `Shipping ${formatMoney(item.shipping)}`
                      : 'Shipping TBA'}
                  </Text>
                </View>
                <Icon name="chevronRight" color="secondary" size={14} />
              </View>
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
  headerBlock: {
    gap: spacing[4],
    marginBottom: spacing[2],
  },
  kicker: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing[1],
  },
  lead: {
    marginTop: spacing[1],
    maxWidth: 340,
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
  orderCard: {
    ...cardShellElevated,
    flexDirection: 'row',
    marginBottom: spacing[1],
  },
  pressed: {
    opacity: 0.94,
  },
  statusRail: {
    width: 5,
  },
  orderBody: {
    flex: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  orderTop: {
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
  flex: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  totalBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
