import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Card,
  EmptyState,
  Header,
  Icon,
  LoadingState,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {spacing} from '../../../theme/spacing';
import type {Order, OrderStatus} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'OrderDetails'>;

const STEPS: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

function stepIndex(status: OrderStatus): number {
  if (status === 'cancelled') {
    return -1;
  }
  const idx = STEPS.indexOf(status);
  return idx >= 0 ? idx : 0;
}

export function OrderDetailsScreen({navigation, route}: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAppApi().orders.getOrder(route.params.orderId);
        if (!cancelled) {
          setOrder(data);
        }
      } catch {
        if (!cancelled) {
          setOrder(null);
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
  }, [route.params.orderId]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  if (loading) {
    return (
      <Screen>
        <Header title="Order" left={back} />
        <LoadingState message="Loading order…" />
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen>
        <Header title="Order" left={back} />
        <EmptyState
          title="Order unavailable"
          description="Order details require a confirmed orders API contract."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  const activeStep = stepIndex(order.status);

  return (
    <Screen scroll backgroundColor={colors.background}>
      <Header title={`Order #${order.id.slice(-8)}`} left={back} />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixture — not a live fulfilment record
        </Text>
      ) : null}

      <View style={[styles.summary, elevation[2]]}>
        <View style={styles.summaryTop}>
          <Badge label={order.status} variant="info" />
          <Text variant="caption" color="inverse" style={styles.summaryDate}>
            Placed {formatDate(order.createdAt)}
          </Text>
        </View>
        <Text variant="h1" color="inverse">
          {formatMoney(order.total)}
        </Text>
        <Text variant="bodySmall" color="inverse" style={styles.summaryHint}>
          {order.items.length} line item{order.items.length === 1 ? '' : 's'}
        </Text>
      </View>

      {order.status !== 'cancelled' ? (
        <Card style={styles.card}>
          <Text variant="label">Fulfilment timeline</Text>
          <View style={styles.timeline}>
            {STEPS.map((step, index) => {
              const done = index <= activeStep;
              return (
                <View key={step} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepDot,
                      done ? styles.stepDotDone : styles.stepDotPending,
                    ]}>
                    {done ? <Icon name="check" color="inverse" size={10} /> : null}
                  </View>
                  {index < STEPS.length - 1 ? (
                    <View
                      style={[
                        styles.stepLine,
                        index < activeStep && styles.stepLineDone,
                      ]}
                    />
                  ) : null}
                  <Text
                    variant="caption"
                    color={done ? 'primary' : 'secondary'}
                    style={styles.stepLabel}>
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      ) : null}

      <Card style={styles.card}>
        <Text variant="label">Line items</Text>
        {order.items.map(item => (
          <View key={item.id} style={styles.lineRow}>
            <View style={styles.flex}>
              <Text variant="h3">{item.productName}</Text>
              <Text variant="caption" color="secondary">
                {item.quantity} × {formatMoney(item.unitPrice)}
              </Text>
            </View>
            <Text variant="label">{formatMoney(item.lineTotal)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <Row label="Subtotal" value={formatMoney(order.subtotal)} />
        {order.shipping ? (
          <Row label="Shipping" value={formatMoney(order.shipping)} />
        ) : null}
        <Row label="Total" value={formatMoney(order.total)} emphasize />
      </Card>

      <Text variant="caption" color="secondary">
        Cancellation and returns are only available when authorized by the
        backend.
      </Text>
    </Screen>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text variant={emphasize ? 'label' : 'body'} color="secondary">
        {label}
      </Text>
      <Text variant={emphasize ? 'h3' : 'body'}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[2]},
  summary: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing[5],
    gap: spacing[2],
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDate: {
    opacity: 0.85,
  },
  summaryHint: {
    opacity: 0.88,
  },
  card: {
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  timeline: {
    gap: spacing[4],
    marginTop: spacing[2],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    position: 'relative',
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: colors.primary,
  },
  stepDotPending: {
    backgroundColor: colors.border,
  },
  stepLine: {
    position: 'absolute',
    left: 10,
    top: 22,
    width: 2,
    height: spacing[4],
    backgroundColor: colors.border,
  },
  stepLineDone: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    textTransform: 'capitalize',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  flex: {flex: 1, gap: 2},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
  },
});
