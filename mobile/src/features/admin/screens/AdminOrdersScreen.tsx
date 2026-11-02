import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Badge} from '../../../components/ui/Badge';
import {Card} from '../../../components/ui/Card';
import {Chip} from '../../../components/ui/Chip';
import {EmptyState} from '../../../components/ui/EmptyState';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {SearchBar} from '../../../components/ui/SearchBar';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import type {AdminOrderPreview} from '../../../types';

type FilterKey = 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped';

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'pending', label: 'Pending'},
  {key: 'confirmed', label: 'Confirmed'},
  {key: 'processing', label: 'Packing'},
  {key: 'shipped', label: 'On the way'},
];

function badgeVariant(
  status: string,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'shipped':
      return 'info';
    case 'processing':
    case 'confirmed':
      return 'warning';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'neutral';
  }
}

export function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orders, setOrders] = useState<AdminOrderPreview[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(
    async (opts?: {page?: number; refresh?: boolean; append?: boolean}) => {
      const nextPage = opts?.page ?? 1;
      if (opts?.refresh) {
        setRefreshing(true);
      } else if (opts?.append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const result = await getAppApi().admin.listActiveOrders({
          page: nextPage,
          pageSize: 20,
          status: filter,
          query,
        });
        setOrders(prev =>
          opts?.append ? [...prev, ...result.items] : result.items,
        );
        setPage(result.page);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      } catch {
        if (!opts?.append) {
          setOrders([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [filter, query],
  );

  useEffect(() => {
    void load({page: 1});
  }, [load]);

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void load({page: 1, refresh: true})}
            tintColor={colors.primary}
          />
        }
        onEndReached={() => {
          if (!loading && !loadingMore && page < totalPages) {
            void load({page: page + 1, append: true});
          }
        }}
        onEndReachedThreshold={0.4}
        contentContainerStyle={[
          styles.list,
          {paddingTop: insets.top + spacing[2]},
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <TabPageHeader
              kicker="Operations"
              title="Orders"
              description={`${totalItems} active · search and filter without loading everything on Overview.`}
            />
            <SearchBar
              placeholder="Search retailer, wholesaler, product…"
              value={query}
              onChangeText={setQuery}
            />
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
              title="No orders match"
              description="Try another status or clear the search."
            />
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <Text variant="caption" color="secondary" style={styles.footer}>
              Loading more…
            </Text>
          ) : undefined
        }
        renderItem={({item}) => <OrderCard order={item} />}
      />
    </Screen>
  );
}

function OrderCard({order}: {order: AdminOrderPreview}) {
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.iconBubble}>
          <Icon name="orders" color="primary" size={16} />
        </View>
        <View style={styles.flex}>
          <Text variant="h3" numberOfLines={1}>
            {order.retailerLabel}
          </Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            via {order.supplierLabel}
          </Text>
        </View>
        <Badge label={order.statusLabel} variant={badgeVariant(order.status)} />
      </View>
      <Text variant="bodySmall" color="secondary">
        {order.summaryLine}
      </Text>
      <View style={styles.footerRow}>
        <Text variant="caption" color="secondary">
          {order.createdAt}
        </Text>
        <Text variant="label" color="accent">
          {order.totalLabel}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inner: {flex: 1, paddingHorizontal: 0, paddingVertical: 0},
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[3],
  },
  headerBlock: {gap: spacing[3], marginBottom: spacing[1]},
  filters: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2]},
  card: {
    gap: spacing[2],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {textAlign: 'center', paddingVertical: spacing[3]},
});
