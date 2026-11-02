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
import type {IconName} from '../../../theme/icons';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {Order, OrderStatus} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Nav = NativeStackNavigationProp<SupplierStackParamList>;
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

export function SupplierOrdersScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().supplier.listSupplierOrders(1, 40);
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

  const toShip = orders.filter(
    o => o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed',
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
          <TabPageHeader
            kicker="Fulfilment"
            title="Orders"
            description="Pack, ship, and update status for orders from awarded quotations.">
            <FadeIn delay={80}>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Icon name="orders" color="accent" size={18} />
                  <Text variant="h2">{orders.length}</Text>
                  <Text variant="caption" color="secondary">
                    All orders
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="package" color="primary" size={18} />
                  <Text variant="h2">{toShip}</Text>
                  <Text variant="caption" color="secondary">
                    Need action
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
            <LoadingState message="Loading orders…" />
          ) : (
            <EmptyState
              title="No orders to fulfil"
              description={
                filter === 'all'
                  ? 'When retailers accept your quotes, fulfilment jobs appear here.'
                  : 'No orders match this status filter.'
              }
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('SupplierOrderDetails', {orderId: item.id})
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
                    Received {formatDate(item.createdAt)}
                  </Text>
                </View>
                <Badge
                  label={item.status}
                  variant={statusVariant(item.status)}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.orderMeta}>
                <Text variant="bodySmall" color="secondary" numberOfLines={1}>
                  {item.items.length} line
                  {item.items.length === 1 ? '' : 's'} to fulfil
                </Text>
                <Text variant="h3" color="accent">
                  {formatMoney(item.total)}
                </Text>
              </View>
              <View style={styles.footerRow}>
                <Text variant="caption" color="secondary">
                  Update packing & shipping status
                </Text>
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
  },
  pressed: {opacity: 0.94},
  statusRail: {width: 5},
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
  flex: {flex: 1, gap: 2},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[3],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
