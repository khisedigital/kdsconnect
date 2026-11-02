import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
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
import type {Rfq} from '../../../types';
import {formatDate} from '../../../utils/format';

type Props = NativeStackScreenProps<SupplierStackParamList, 'SupplierRfqDetails'>;

export function SupplierRfqDetailsScreen({navigation, route}: Props) {
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppApi().rfqs.getRfq(route.params.rfqId);
      setRfq(data);
    } catch {
      setRfq(null);
    } finally {
      setLoading(false);
    }
  }, [route.params.rfqId]);

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
        <Header title="RFQ" left={back} />
        <LoadingState message="Loading RFQ…" />
      </Screen>
    );
  }

  if (!rfq) {
    return (
      <Screen>
        <Header title="RFQ" left={back} />
        <EmptyState
          title="RFQ unavailable"
          description="Supplier RFQ details require a confirmed backend RFQ contract."
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
          Development fixture — not live retailer RFQ data
        </Text>
      ) : null}
      <View style={styles.heading}>
        <Text variant="h2" style={styles.flex}>
          {rfq.title}
        </Text>
        <Badge label={rfq.status} variant="info" />
      </View>
      <Text variant="caption" color="secondary">
        Received {formatDate(rfq.createdAt)}
        {rfq.dueDate ? ` · Due ${formatDate(rfq.dueDate)}` : null}
      </Text>
      <Card style={styles.card}>
        <Text variant="label">Requested lines</Text>
        {rfq.items.map(item => (
          <ListRow
            key={item.id}
            title={item.description}
            subtitle={`${item.quantity}${item.unit ? ` ${item.unit}` : ''}`}
          />
        ))}
      </Card>
      <Button
        title="Submit quotation"
        fullWidth
        onPress={() =>
          navigation.navigate('SupplierQuotationForm', {rfqId: rfq.id})
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
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  flex: {flex: 1},
  card: {marginVertical: spacing[4], gap: spacing[1]},
});
