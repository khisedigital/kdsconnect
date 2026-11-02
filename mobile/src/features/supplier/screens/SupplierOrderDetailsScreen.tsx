import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Card,
  EmptyState,
  Header,
  Icon,
  ListRow,
  LoadingState,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {spacing} from '../../../theme/spacing';
import type {Order} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<
  SupplierStackParamList,
  'SupplierOrderDetails'
>;

export function SupplierOrderDetailsScreen({navigation, route}: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppApi().orders.getOrder(route.params.orderId);
      setOrder(data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [route.params.orderId]);

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
          description="Supplier order details require a confirmed backend orders API contract."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="Fulfillment order" left={back} />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixture — not live fulfillment data
        </Text>
      ) : null}
      <View style={styles.heading}>
        <Text variant="h2">#{order.id.slice(-8)}</Text>
        <Badge label={order.status} variant="info" />
      </View>
      <Text variant="caption" color="secondary">
        Retailer {order.retailerId} · {formatDate(order.createdAt)}
      </Text>
      <Card style={styles.card}>
        <Text variant="label">Pick & pack lines</Text>
        {order.items.map(item => (
          <ListRow
            key={item.id}
            title={item.productName}
            subtitle={`Qty ${item.quantity}`}
            right={<Text variant="label">{formatMoney(item.lineTotal)}</Text>}
          />
        ))}
      </Card>
      <View style={styles.total}>
        <Text variant="label">Order total</Text>
        <Text variant="h3">{formatMoney(order.total)}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[2]},
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  card: {marginVertical: spacing[4], gap: spacing[1]},
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
