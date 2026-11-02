import React, {useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Header,
  Icon,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {spacing} from '../../../theme/spacing';
import type {Rfq, RfqStatus} from '../../../types';
import {formatDate} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'RfqList'>;

function getDevRfqs(): Rfq[] {
  if (!appConfig.enableDevPreview) {
    return [];
  }
  const now = new Date().toISOString();
  return [
    {
      id: 'rfq-1',
      retailerId: 'ret-1',
      title: 'Weekly dry goods restock',
      status: 'submitted',
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
    },
    {
      id: 'rfq-2',
      retailerId: 'ret-1',
      title: 'Cooking oil bulk',
      status: 'quoted',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: now,
      items: [
        {
          id: 'ri-2',
          productId: 'p2',
          description: 'Sunflower Oil 15L',
          quantity: 24,
          unit: 'case',
        },
      ],
    },
  ];
}

const statusVariant: Record<
  RfqStatus,
  'success' | 'warning' | 'info' | 'neutral' | 'error'
> = {
  draft: 'neutral',
  submitted: 'info',
  quoted: 'success',
  awarded: 'success',
  cancelled: 'error',
  expired: 'warning',
};

export function RfqListScreen({navigation}: Props) {
  const data = useMemo(() => getDevRfqs(), []);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header
        title="Requests for quotation"
        left={back}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create RFQ"
            onPress={() => navigation.navigate('RfqCreate')}>
            <Icon name="plus" />
          </Pressable>
        }
      />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixtures — not live RFQ data
        </Text>
      ) : null}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No RFQs yet"
            description={
              appConfig.enableDevPreview
                ? 'Create a request to explore the flow.'
                : 'RFQ listing requires a confirmed backend contract.'
            }
            action={{
              label: 'Create RFQ',
              onPress: () => navigation.navigate('RfqCreate'),
            }}
          />
        }
        renderItem={({item}) => (
          <Card
            onPress={() => navigation.navigate('RfqDetails', {rfqId: item.id})}
            style={styles.card}>
            <View style={styles.row}>
              <Text variant="h3" style={styles.title}>
                {item.title}
              </Text>
              <Badge label={item.status} variant={statusVariant[item.status]} />
            </View>
            <Text color="secondary" numberOfLines={1}>
              {item.items.map(i => i.description).join(', ')}
            </Text>
            <Text variant="caption" color="secondary" style={styles.meta}>
              {formatDate(item.createdAt)} · {item.items.length} line(s)
            </Text>
            {item.status === 'quoted' ? (
              <Button
                title="Compare quotations"
                size="sm"
                variant="outline"
                style={styles.compare}
                onPress={() =>
                  navigation.navigate('QuotationCompare', {rfqId: item.id})
                }
              />
            ) : null}
          </Card>
        )}
      />
      <View style={styles.footer}>
        <Button
          title="New RFQ"
          fullWidth
          onPress={() => navigation.navigate('RfqCreate')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dev: {paddingHorizontal: spacing[4], marginBottom: spacing[2]},
  list: {padding: spacing[4], paddingBottom: spacing[12], flexGrow: 1},
  card: {marginBottom: spacing[3]},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  title: {flex: 1},
  meta: {marginTop: spacing[1]},
  compare: {marginTop: spacing[3], alignSelf: 'flex-start'},
  footer: {
    padding: spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DCE3EA',
  },
});
