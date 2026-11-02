import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  RetailerStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {
  Badge,
  Chip,
  EmptyState,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import type {IconName} from '../../../theme/icons';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {AppNotification, NotificationType} from '../../../types';
import {formatDate} from '../../../utils/format';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'Notifications'>
  | NativeStackScreenProps<SupplierStackParamList, 'Notifications'>;

type FilterKey = 'all' | 'unread' | NotificationType;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'unread', label: 'Unread'},
  {key: 'order_update', label: 'Orders'},
  {key: 'rfq_update', label: 'RFQs'},
  {key: 'group_buy_update', label: 'Group buy'},
];

function typeIcon(type: NotificationType): IconName {
  switch (type) {
    case 'order_update':
      return 'truck';
    case 'rfq_update':
    case 'quotation_received':
      return 'quote';
    case 'group_buy_update':
      return 'group';
    default:
      return 'bell';
  }
}

function typeLabel(type: NotificationType): string {
  switch (type) {
    case 'order_update':
      return 'Order';
    case 'rfq_update':
      return 'RFQ';
    case 'quotation_received':
      return 'Quotation';
    case 'group_buy_update':
      return 'Group buy';
    default:
      return 'System';
  }
}

export function NotificationsScreen({navigation}: Props) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const page = await getAppApi().notifications.listNotifications(1, 50);
        if (!cancelled) {
          setItems(page.items);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return items;
    }
    if (filter === 'unread') {
      return items.filter(item => !item.read);
    }
    return items.filter(item => item.type === filter);
  }, [filter, items]);

  const unreadCount = items.filter(item => !item.read).length;

  return (
    <Screen
      edges={['top', 'left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SubpageHero
              title="Notifications"
              kicker="Inbox"
              description={
                unreadCount > 0
                  ? `You have ${unreadCount} unread update${unreadCount === 1 ? '' : 's'}.`
                  : 'You are caught up on alerts.'
              }
              icon="bell"
              onBack={() => navigation.goBack()}
            />
            {appConfig.enableDevPreview ? (
              <Text variant="caption" color="warning">
                Development fixtures may populate this list
              </Text>
            ) : null}
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
            <LoadingState message="Loading notifications…" />
          ) : (
            <EmptyState
              title="No notifications"
              description={
                filter === 'all'
                  ? 'Order, RFQ, and campaign alerts will appear here.'
                  : 'Nothing matches this filter.'
              }
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            style={({pressed}) => [
              styles.card,
              !item.read && styles.unreadCard,
              pressed && styles.pressed,
            ]}>
            <View
              style={[
                styles.iconWrap,
                !item.read ? styles.iconUnread : styles.iconRead,
              ]}>
              <Icon
                name={typeIcon(item.type)}
                color={!item.read ? 'accent' : 'primary'}
                size={16}
              />
            </View>
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text variant="h3" style={styles.flex} numberOfLines={1}>
                  {item.title}
                </Text>
                {!item.read ? <View style={styles.dot} /> : null}
              </View>
              <Text variant="bodySmall" color="secondary" numberOfLines={2}>
                {item.body}
              </Text>
              <View style={styles.metaRow}>
                <Badge label={typeLabel(item.type)} variant="neutral" />
                <Text variant="caption" color="tertiary">
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>
          </Pressable>
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
    flexGrow: 1,
  },
  headerBlock: {gap: spacing[3], marginBottom: spacing[1]},
  filters: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2]},
  card: {
    ...cardShellElevated,
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
  },
  unreadCard: {
    borderColor: colors.primaryMuted,
  },
  pressed: {opacity: 0.94},
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUnread: {backgroundColor: colors.accentSoft},
  iconRead: {backgroundColor: colors.primarySoft},
  body: {flex: 1, gap: spacing[1]},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  flex: {flex: 1},
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
});
