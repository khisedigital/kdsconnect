import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Header,
  Icon,
  LoadingState,
  ProgressBar,
  QuantityStepper,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {GroupBuyCampaign} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'GroupBuyDetails'>;

export function GroupBuyDetailsScreen({navigation, route}: Props) {
  const [campaign, setCampaign] = useState<GroupBuyCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [joining, setJoining] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppApi().groupBuying.getCampaign(
        route.params.campaignId,
      );
      setCampaign(data);
      setQty(1);
    } catch {
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  }, [route.params.campaignId]);

  useEffect(() => {
    void load();
  }, [load]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  const onJoin = async () => {
    if (!campaign || joining) {
      return;
    }
    if (!appConfig.enableDevPreview) {
      Alert.alert(
        'Backend required',
        'Joining a group buy requires a confirmed group-buy participation API. This action is not sent to production.',
      );
      return;
    }
    setJoining(true);
    try {
      await getAppApi().groupBuying.joinCampaign(campaign.id, {quantity: qty});
      Alert.alert(
        'Development preview',
        'Your participation was recorded in the dev fixture only.',
        [{text: 'OK', onPress: () => void load()}],
      );
    } catch (e) {
      Alert.alert(
        'Could not join',
        e instanceof Error ? e.message : 'Join failed in development preview.',
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <Header title="Group buy" left={back} />
        <LoadingState message="Loading campaign…" />
      </Screen>
    );
  }

  if (!campaign) {
    return (
      <Screen>
        <Header title="Group buy" left={back} />
        <EmptyState
          title="Campaign unavailable"
          description="Campaign details require a confirmed backend contract or a matching development fixture."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  const canJoin =
    campaign.status === 'open' || campaign.status === 'threshold_met';

  return (
    <Screen scroll backgroundColor={colors.background}>
      <Header title="Campaign details" left={back} />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixture — progress values are not live
        </Text>
      ) : null}

      <View style={[styles.hero, elevation[2]]}>
        <View style={styles.heroOrb} />
        <Badge label={campaign.status.replace('_', ' ')} variant="info" />
        <Text variant="h1" color="inverse" style={styles.heroTitle}>
          {campaign.title}
        </Text>
        {campaign.description ? (
          <Text variant="bodySmall" color="inverse" style={styles.heroBody}>
            {campaign.description}
          </Text>
        ) : null}
        <View style={styles.heroMeta}>
          <View style={styles.metaChip}>
            <Icon name="calendar" color="inverse" size={13} />
            <Text variant="caption" color="inverse">
              Ends {formatDate(campaign.endsAt)}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Icon name="percentage" color="inverse" size={13} />
            <Text variant="caption" color="inverse">
              {formatMoney(campaign.unitPrice)} / unit
            </Text>
          </View>
        </View>
      </View>

      <Card style={styles.card}>
        <Text variant="label">Campaign progress</Text>
        <ProgressBar
          current={campaign.currentQuantity}
          target={campaign.targetQuantity}
          label="Toward target quantity"
        />
      </Card>

      <Card style={styles.card}>
        <Text variant="label">Your participation quantity</Text>
        <QuantityStepper value={qty} min={1} max={9999} onChange={setQty} />
        <Text variant="caption" color="secondary">
          Estimated line total {formatMoney({
            amount: campaign.unitPrice.amount * qty,
            currency: campaign.unitPrice.currency,
          })}
        </Text>
      </Card>

      <Button
        title={canJoin ? 'Join campaign' : 'Campaign unavailable'}
        fullWidth
        size="lg"
        loading={joining}
        disabled={!canJoin}
        onPress={() => void onJoin()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[2]},
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing[5],
    overflow: 'hidden',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  heroOrb: {
    position: 'absolute',
    top: -36,
    right: -24,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  heroTitle: {
    maxWidth: 300,
  },
  heroBody: {
    opacity: 0.9,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  card: {
    marginBottom: spacing[3],
    gap: spacing[3],
  },
});
