import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Pressable, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Button,
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
import type {Rfq, RfqItem} from '../../../types';

type Props = NativeStackScreenProps<
  SupplierStackParamList,
  'SupplierQuotationForm'
>;

function buildSchema(items: RfqItem[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    validUntilNotes: z.string().optional(),
  };
  for (const item of items) {
    shape[`price_${item.id}`] = z
      .string()
      .min(1, 'Enter unit price')
      .refine(val => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Enter a valid price',
      });
    shape[`lead_${item.id}`] = z.string().optional();
  }
  return z.object(shape);
}

type FormValues = Record<string, string | undefined>;

export function SupplierQuotationFormScreen({navigation, route}: Props) {
  const [rfq, setRfq] = useState<Rfq | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const schema = useMemo(
    () => (rfq ? buildSchema(rfq.items) : z.object({})),
    [rfq],
  );

  const defaultValues = useMemo(() => {
    if (!rfq) {
      return {};
    }
    const values: FormValues = {validUntilNotes: ''};
    for (const item of rfq.items) {
      values[`price_${item.id}`] = '';
      values[`lead_${item.id}`] = '';
    }
    return values;
  }, [rfq]);

  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  const onSubmit = handleSubmit(async values => {
    if (submitting || !rfq) {
      return;
    }
    if (!appConfig.enableDevPreview) {
      Alert.alert(
        'Backend required',
        'Supplier quotations cannot be submitted until the quotation create API contract is confirmed.',
      );
      return;
    }
    setSubmitting(true);
    try {
      void values;
      Alert.alert(
        'Development preview',
        'Quotation line prices validated locally. Nothing was sent to a production API.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } finally {
      setSubmitting(false);
    }
  });

  if (loading) {
    return (
      <Screen>
        <Header title="Quotation" left={back} />
        <LoadingState message="Loading RFQ lines…" />
      </Screen>
    );
  }

  if (!rfq) {
    return (
      <Screen>
        <Header title="Quotation" left={back} />
        <EmptyState
          title="RFQ unavailable"
          description="Cannot price lines without RFQ details from the backend."
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll keyboardAvoiding>
      <Header title="Submit quotation" left={back} />
      <Text color="secondary" style={styles.lead}>
        Enter unit prices per RFQ line. Production submission requires an
        authorized supplier quotation endpoint.
      </Text>
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development preview — validated locally only
        </Text>
      ) : null}
      {rfq.items.map(item => (
        <Card key={item.id} style={styles.card}>
          <Text variant="label">{item.description}</Text>
          <Text variant="caption" color="secondary">
            Qty {item.quantity}
            {item.unit ? ` ${item.unit}` : ''}
          </Text>
          <FormTextField
            control={control}
            name={`price_${item.id}`}
            label="Unit price"
            placeholder="0.00"
            keyboardType="decimal-pad"
          />
          <FormTextField
            control={control}
            name={`lead_${item.id}`}
            label="Lead time (days, optional)"
            placeholder="e.g. 3"
            keyboardType="number-pad"
          />
        </Card>
      ))}
      <Card style={styles.card}>
        <FormTextField
          control={control}
          name="validUntilNotes"
          label="Notes (optional)"
          placeholder="Validity, incoterms, delivery"
          multiline
        />
      </Card>
      <Button
        title="Submit quotation"
        fullWidth
        loading={submitting}
        onPress={() => void onSubmit()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {marginBottom: spacing[2]},
  dev: {marginBottom: spacing[3]},
  card: {marginBottom: spacing[3], gap: spacing[2]},
});
