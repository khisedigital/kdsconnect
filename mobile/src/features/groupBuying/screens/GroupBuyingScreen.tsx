import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {Badge} from '../../../components/ui/Badge';
import {Chip} from '../../../components/ui/Chip';
import {EmptyState} from '../../../components/ui/EmptyState';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {ProgressBar} from '../../../components/ui/ProgressBar';
import {Screen} from '../../../components/ui/Screen';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {GroupBuyCampaign, GroupBuyCampaignStatus} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Nav = NativeStackNavigationProp<RetailerStackParamList>;

type FilterKey = 'all' | 'open' | 'threshold_met' | 'closed';

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'all', label: 'All'},
  {key: 'open', label: 'Open'},
  {key: 'threshold_met', label: 'Target met'},
  {key: 'closed', label: 'Closed'},
];

function statusBadgeVariant(
  status: GroupBuyCampaignStatus,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'open':
      return 'info';
    case 'threshold_met':
      return 'success';
    case 'fulfilled':
      return 'success';
    case 'closed':
      return 'neutral';
    case 'cancelled':
      return 'error';
    default:
      return 'warning';
  }
}

function daysLeft(endsAt: string): string {
  const end = new Date(endsAt).getTime();
  if (Number.isNaN(end)) {
    return 'Date TBA';
  }
  const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) {
    return 'Ended';
  }
  if (diff === 0) {
    return 'Ends today';
  }
  if (diff === 1) {
    return '1 day left';
  }
  return `${diff} days left`;
}

export function GroupBuyingScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<GroupBuyCampaign[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().groupBuying.listCampaigns(1, 30);
      setCampaigns(result.items);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return campaigns;
    }
    return campaigns.filter(c => c.status === filter);
  }, [campaigns, filter]);

  const openCount = campaigns.filter(c => c.status === 'open').length;

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
                Volume purchasing
              </Text>
              <Text variant="h1">Group buy</Text>
              <Text variant="bodySmall" color="secondary" style={styles.lead}>
                Lock better unit prices when the community hits the target
                quantity.
              </Text>
            </FadeIn>

            <FadeIn delay={80}>
              <View style={[styles.hero, elevation[2]]}>
                <View style={styles.heroOrb} />
                <View style={styles.heroIcon}>
                  <Icon name="percentage" color="inverse" size={22} />
                </View>
                <Text variant="caption" color="inverse" style={styles.heroKicker}>
                  Active opportunities
                </Text>
                <Text variant="h2" color="inverse">
                  {openCount} open campaign{openCount === 1 ? '' : 's'}
                </Text>
                <Text variant="bodySmall" color="inverse" style={styles.heroBody}>
                  Progress updates from verified campaign data only.
                </Text>
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
            <LoadingState message="Loading campaigns…" />
          ) : (
            <EmptyState
              title="No campaigns here"
              description={
                filter === 'all'
                  ? 'Join group buys when suppliers launch volume campaigns.'
                  : 'Nothing matches this filter right now.'
              }
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('GroupBuyDetails', {campaignId: item.id})
            }
            style={({pressed}) => [
              styles.campaignCard,
              pressed && styles.pressed,
            ]}>
            <View style={styles.campaignMedia}>
              <View style={styles.mediaOrb} />
              <Icon name="group" color="inverse" size={28} />
              <Badge
                label={item.status.replace('_', ' ')}
                variant={statusBadgeVariant(item.status)}
                style={styles.statusBadge}
              />
            </View>
            <View style={styles.campaignBody}>
              <Text variant="h3" numberOfLines={2}>
                {item.title}
              </Text>
              {item.description ? (
                <Text variant="bodySmall" color="secondary" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Icon name="calendar" color="secondary" size={14} />
                  <Text variant="caption" color="secondary">
                    {daysLeft(item.endsAt)}
                  </Text>
                </View>
                <Text variant="label" color="accent">
                  {formatMoney(item.unitPrice)}
                </Text>
              </View>
              <ProgressBar
                current={item.currentQuantity}
                target={item.targetQuantity}
                label="Campaign progress"
              />
              <Text variant="caption" color="tertiary">
                Ends {formatDate(item.endsAt)}
              </Text>
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
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing[5],
    overflow: 'hidden',
    gap: spacing[2],
  },
  heroOrb: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  heroKicker: {
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroBody: {
    opacity: 0.88,
    maxWidth: 280,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  campaignCard: {
    ...cardShellElevated,
    marginBottom: spacing[1],
  },
  pressed: {
    opacity: 0.94,
  },
  campaignMedia: {
    height: 96,
    backgroundColor: colors.brand.mid,
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    overflow: 'hidden',
  },
  mediaOrb: {
    position: 'absolute',
    top: -30,
    right: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
  },
  campaignBody: {
    padding: spacing[4],
    gap: spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
