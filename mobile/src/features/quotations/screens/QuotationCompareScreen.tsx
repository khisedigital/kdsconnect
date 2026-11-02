import React, {useMemo, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  Header,
  Icon,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import type {Money} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'QuotationCompare'>;

interface CompareRow {
  quotationId: string;
  supplierName: string;
  itemSubtotal: Money;
  tax: Money;
  delivery: Money;
  total: Money;
  validUntil: string;
  terms: string;
}

function getDevComparisons(rfqId: string): CompareRow[] {
  if (!appConfig.enableDevPreview) {
    return [];
  }
  void rfqId;
  return [
    {
      quotationId: 'q-1',
      supplierName: 'Metro Wholesale Foods',
      itemSubtotal: {amount: 72000, currency: 'INR'},
      tax: {amount: 12960, currency: 'INR'},
      delivery: {amount: 1500, currency: 'INR'},
      total: {amount: 86460, currency: 'INR'},
      validUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
      terms: 'Net 15 · Free delivery above ₹50,000',
    },
    {
      quotationId: 'q-2',
      supplierName: 'Coastal Supply Co.',
      itemSubtotal: {amount: 70000, currency: 'INR'},
      tax: {amount: 12600, currency: 'INR'},
      delivery: {amount: 2800, currency: 'INR'},
      total: {amount: 85400, currency: 'INR'},
      validUntil: new Date(Date.now() + 86400000 * 3).toISOString(),
      terms: 'Net 7 · Delivery charged separately',
    },
  ];
}

export function QuotationCompareScreen({navigation, route}: Props) {
  const rows = useMemo(
    () => getDevComparisons(route.params.rfqId),
    [route.params.rfqId],
  );
  const [pendingId, setPendingId] = useState<string | null>(null);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  if (rows.length === 0) {
    return (
      <Screen>
        <Header title="Compare quotations" left={back} />
        <EmptyState
          title="No quotations to compare"
          description="Comparison data requires confirmed quotation APIs from the backend team."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  const lowest = Math.min(...rows.map(r => r.total.amount));

  return (
    <Screen scroll>
      <Header title="Compare quotations" left={back} />
      <Text color="secondary" style={styles.lead}>
        Landed cost breakdown. Acceptance is only allowed through an authorized
        backend operation.
      </Text>
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixtures — not live supplier quotations
        </Text>
      ) : null}
      {rows.map(row => (
        <Card key={row.quotationId} style={styles.card}>
          <View style={styles.row}>
            <Text variant="h3" style={styles.flex}>
              {row.supplierName}
            </Text>
            {row.total.amount === lowest ? (
              <Badge label="Lowest total" variant="success" />
            ) : null}
          </View>
          <Breakdown label="Items" value={formatMoney(row.itemSubtotal)} />
          <Breakdown label="Tax" value={formatMoney(row.tax)} />
          <Breakdown label="Delivery" value={formatMoney(row.delivery)} />
          <View style={styles.totalRow}>
            <Text variant="label">Total landed</Text>
            <Text variant="h3">{formatMoney(row.total)}</Text>
          </View>
          <Text variant="caption" color="secondary">
            Valid until {formatDate(row.validUntil)}
          </Text>
          <Text variant="caption" color="secondary">
            {row.terms}
          </Text>
          <Button
            title="Review acceptance"
            variant="outline"
            size="sm"
            style={styles.accept}
            onPress={() => setPendingId(row.quotationId)}
          />
        </Card>
      ))}
      <Dialog
        visible={pendingId != null}
        title="Accept quotation?"
        description="Acceptance must be authorized by the backend. In development preview this action is simulated only and does not create a live order."
        confirmLabel="Simulate accept"
        cancelLabel="Cancel"
        onConfirm={() => {
          setPendingId(null);
          Alert.alert(
            'Development preview',
            'Acceptance was not sent to a production API.',
          );
        }}
        onCancel={() => setPendingId(null)}
      />
    </Screen>
  );
}

function Breakdown({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.breakdown}>
      <Text color="secondary">{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: {marginBottom: spacing[2]},
  dev: {marginBottom: spacing[3]},
  card: {marginBottom: spacing[3], gap: spacing[1]},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  flex: {flex: 1},
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  accept: {marginTop: spacing[3], alignSelf: 'flex-start'},
});
