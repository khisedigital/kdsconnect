import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {AdminStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Card,
  Chip,
  EmptyState,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {SupportQuery, SupportQueryStatus} from '../../../types';
import {formatDate} from '../../../utils/format';

type Props = NativeStackScreenProps<AdminStackParamList, 'SupportQueries'>;

type FilterKey = 'all' | SupportQueryStatus;

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'open', label: 'Open'},
  {key: 'in_progress', label: 'In progress'},
  {key: 'resolved', label: 'Resolved'},
];

function statusVariant(
  status: SupportQueryStatus,
): 'warning' | 'info' | 'success' | 'neutral' {
  switch (status) {
    case 'open':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'neutral';
  }
}

function statusLabel(status: SupportQueryStatus) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In progress';
    case 'resolved':
      return 'Resolved';
    default:
      return status;
  }
}

function roleLabel(role: SupportQuery['userRole']) {
  switch (role) {
    case 'retailer':
      return 'Retailer';
    case 'supplier':
      return 'Wholesaler';
    case 'sales':
      return 'Sales';
    default:
      return role;
  }
}

export function AdminSupportQueriesScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().support.listAllQueries({
        pageSize: 50,
        status: filter,
      });
      setQueries(result.items);
    } catch {
      setQueries([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (
    query: SupportQuery,
    status: SupportQueryStatus,
  ) => {
    if (updatingId) {
      return;
    }
    setUpdatingId(query.id);
    try {
      await getAppApi().support.updateQueryStatus(query.id, {
        status,
        adminNote:
          status === 'in_progress'
            ? 'Admin is reviewing this query.'
            : status === 'resolved'
              ? 'Marked resolved by admin.'
              : undefined,
      });
      await load();
    } catch {
      Alert.alert('Update failed', 'Could not update query status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Screen scroll backgroundColor={colors.background}>
      <SubpageHero
        title="Support queries"
        kicker="Inbox"
        description="Catch queries from retailers and wholesalers. Update status as you work them."
        icon="support"
        tone="teal"
        onBack={() => navigation.goBack()}
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

      {loading ? (
        <LoadingState message="Loading support queries…" />
      ) : queries.length === 0 ? (
        <EmptyState
          title="No queries here"
          description="When retailers or wholesalers send a query, it appears in this inbox."
        />
      ) : (
        queries.map(item => (
          <Card key={item.id} style={styles.queryCard}>
            <View style={styles.top}>
              <View style={styles.iconWrap}>
                <Icon name="support" color="primary" size={18} />
              </View>
              <View style={styles.flex}>
                <Text variant="h3" numberOfLines={2}>
                  {item.subject}
                </Text>
                <Text variant="caption" color="secondary">
                  {item.businessName ?? item.userLabel} ·{' '}
                  {roleLabel(item.userRole)} · {formatDate(item.createdAt)}
                </Text>
              </View>
              <Badge
                label={statusLabel(item.status)}
                variant={statusVariant(item.status)}
              />
            </View>
            <Text variant="bodySmall" color="secondary">
              {item.message}
            </Text>
            {item.adminNote ? (
              <Text variant="caption" color="accent">
                Note: {item.adminNote}
              </Text>
            ) : null}
            <View style={styles.actions}>
              {item.status === 'open' ? (
                <ActionButton
                  label="Start"
                  disabled={updatingId === item.id}
                  onPress={() => void updateStatus(item, 'in_progress')}
                />
              ) : null}
              {item.status !== 'resolved' ? (
                <ActionButton
                  label="Resolve"
                  disabled={updatingId === item.id}
                  onPress={() => void updateStatus(item, 'resolved')}
                />
              ) : null}
              {item.status === 'resolved' ? (
                <ActionButton
                  label="Reopen"
                  disabled={updatingId === item.id}
                  onPress={() => void updateStatus(item, 'open')}
                />
              ) : null}
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.actionButton,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text variant="caption" color="primary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  queryCard: {
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  actionButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {opacity: 0.9},
  disabled: {opacity: 0.5},
});
