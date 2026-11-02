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
import {spacing} from '../../../theme/spacing';
import type {Quotation} from '../../../types';
import {formatDate, formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'QuotationDetails'>;

export function QuotationDetailsScreen({navigation, route}: Props) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getAppApi().quotations.getQuotation(
          route.params.quotationId,
        );
        if (!cancelled) {
          setQuotation(data);
        }
      } catch {
        if (!cancelled) {
          setQuotation(null);
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
  }, [route.params.quotationId]);

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
        <Header title="Quotation" left={back} />
        <LoadingState />
      </Screen>
    );
  }

  if (!quotation) {
    return (
      <Screen>
        <Header title="Quotation" left={back} />
        <EmptyState
          title="Quotation unavailable"
          description="Details require a confirmed quotations API contract."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="Quotation details" left={back} />
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development fixture — not a live commercial offer
        </Text>
      ) : null}
      <View style={styles.heading}>
        <Badge label={quotation.status} variant="info" />
        <Text variant="caption" color="secondary">
          Valid until {formatDate(quotation.validUntil)}
        </Text>
      </View>
      <Card style={styles.card}>
        {quotation.lines.map(line => (
          <View key={line.id} style={styles.line}>
            <Text variant="body">
              Qty {line.quantity} · {formatMoney(line.unitPrice)}
            </Text>
            {line.leadTimeDays != null ? (
              <Text variant="caption" color="secondary">
                Lead time {line.leadTimeDays} day(s)
              </Text>
            ) : null}
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dev: {marginBottom: spacing[2]},
  heading: {gap: spacing[2], marginBottom: spacing[3]},
  card: {gap: spacing[2]},
  line: {paddingVertical: spacing[1]},
});
