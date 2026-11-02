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
import type {AdminRfqPreview} from '../../../types';

type FilterKey = 'all' | 'submitted' | 'quoted' | 'draft';

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'submitted', label: 'Waiting'},
  {key: 'quoted', label: 'Quoted'},
  {key: 'draft', label: 'Draft'},
];

function badgeVariant(
  status: string,
): 'success' | 'warning' | 'info' | 'neutral' {
  switch (status) {
    case 'quoted':
      return 'info';
    case 'submitted':
      return 'warning';
    case 'awarded':
      return 'success';
    default:
      return 'neutral';
  }
}

export function AdminQuotationsScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [rfqs, setRfqs] = useState<AdminRfqPreview[]>([]);
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
        const result = await getAppApi().admin.listRequestedQuotations({
          page: nextPage,
          pageSize: 20,
          status: filter,
          query,
        });
        setRfqs(prev =>
          opts?.append ? [...prev, ...result.items] : result.items,
        );
        setPage(result.page);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      } catch {
        if (!opts?.append) {
          setRfqs([]);
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
        data={rfqs}
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
              title="Quotations"
              description={`${totalItems} open RFQs · use tabs and search; do not scroll thousands on Overview.`}
            />
            <SearchBar
              placeholder="Search title, retailer, product…"
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
            <LoadingState message="Loading quotations…" />
          ) : (
            <EmptyState
              title="No quotations match"
              description="Try Waiting / Quoted, or clear the search."
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
        renderItem={({item}) => <RfqCard rfq={item} />}
      />
    </Screen>
  );
}

function RfqCard({rfq}: {rfq: AdminRfqPreview}) {
  return (
    <Card style={[styles.card, rfq.needsAttention && styles.cardAlert]}>
      <View style={styles.top}>
        <View
          style={[
            styles.iconBubble,
            rfq.needsAttention && styles.iconBubbleAlert,
          ]}>
          <Icon name="quote" color="primary" size={16} />
        </View>
        <View style={styles.flex}>
          <Text variant="h3" numberOfLines={2}>
            {rfq.title}
          </Text>
          <Text variant="caption" color="secondary">
            {rfq.retailerLabel}
          </Text>
        </View>
        <Badge label={rfq.statusLabel} variant={badgeVariant(rfq.status)} />
      </View>
      <Text variant="bodySmall" color="secondary">
        {rfq.summaryLine}
      </Text>
      <View style={styles.footerRow}>
        <Text variant="caption" color="secondary">
          Asked {rfq.createdAt}
          {rfq.dueDate ? ` · due ${rfq.dueDate}` : ''}
        </Text>
        {rfq.needsAttention ? (
          <Text variant="caption" color="accent">
            Needs quotes
          </Text>
        ) : null}
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
  cardAlert: {
    borderColor: colors.accent,
    borderWidth: 1,
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
  iconBubbleAlert: {
    backgroundColor: colors.accentSoft,
  },
  flex: {flex: 1, gap: 2},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {textAlign: 'center', paddingVertical: spacing[3]},
});
