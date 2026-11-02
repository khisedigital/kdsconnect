import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Header,
  Icon,
  ListRow,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {spacing} from '../../../theme/spacing';
import type {Rfq} from '../../../types';
import {formatDate} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'RfqDetails'>;

function getDevRfq(rfqId: string): Rfq | null {
  if (!appConfig.enableDevPreview) {
    return null;
  }
  const now = new Date().toISOString();
  return {
    id: rfqId,
    retailerId: 'ret-1',
    title: 'Weekly dry goods restock',
    status: 'quoted',
    createdAt: now,
    updatedAt: now,
    items: [
      {
        id: 'ri-1',
        productId: 'p1',
        description: 'Basmati Rice 25kg',
        quantity: 40,
        unit: 'case',
      },
    ],
  };
}

export function RfqDetailsScreen({navigation, route}: Props) {
  const rfq = useMemo(() => getDevRfq(route.params.rfqId), [route.params.rfqId]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  if (!rfq) {
    return (
      <Screen>
        <Header title="RFQ" left={back} />
        <EmptyState
          title="RFQ unavailable"
          description="Details require a confirmed backend RFQ contract or a matching development fixture."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="RFQ details" left={back} />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixture — not live RFQ data
        </Text>
      ) : null}
      <View style={styles.heading}>
        <Text variant="h2">{rfq.title}</Text>
        <Badge label={rfq.status} variant="info" />
      </View>
      <Text variant="caption" color="secondary">
        Created {formatDate(rfq.createdAt)}
      </Text>
      <Card style={styles.card}>
        <Text variant="label">Line items</Text>
        {rfq.items.map(item => (
          <ListRow
            key={item.id}
            title={item.description}
            subtitle={`${item.quantity}${item.unit ? ` ${item.unit}` : ''}`}
          />
        ))}
      </Card>
      <Button
        title="Compare quotations"
        fullWidth
        onPress={() =>
          navigation.navigate('QuotationCompare', {rfqId: rfq.id})
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[2]},
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  card: {marginVertical: spacing[4]},
});
