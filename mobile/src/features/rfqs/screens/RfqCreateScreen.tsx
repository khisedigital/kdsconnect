import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Button,
  Card,
  Chip,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';

type Props = NativeStackScreenProps<RetailerStackParamList, 'RfqCreate'>;

const UNITS = ['kg', 'g', 'L', 'case', 'bag', 'pcs', 'ton'] as const;

const schema = z.object({
  title: z.string().min(3, 'Enter a short title for this requirement'),
  itemDescription: z.string().min(2, 'Describe what you need (e.g. Sugar)'),
  quantity: z
    .string()
    .min(1, 'Enter quantity')
    .refine(value => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0;
    }, 'Enter a valid quantity greater than 0'),
  deliveryNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RfqCreateScreen({navigation, route}: Props) {
  const [unit, setUnit] = useState<(typeof UNITS)[number]>('kg');
  const [submitting, setSubmitting] = useState(false);

  const {control, handleSubmit} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      itemDescription: route.params?.productId
        ? `Product ${route.params.productId}`
        : '',
      quantity: '1000',
      deliveryNotes: '',
    },
  });

  const onSubmit = handleSubmit(async values => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'RFQ creation cannot be submitted until the backend RFQ contract is confirmed.',
        );
        return;
      }

      const quantity = Number(values.quantity);
      const api = getAppApi();
      const created = await api.rfqs.createRfq({
        title: values.title.trim(),
        items: [
          {
            description: values.itemDescription.trim(),
            quantity,
            unit,
            productId: route.params?.productId,
            notes: values.deliveryNotes?.trim() || undefined,
          },
        ],
      });
      await api.rfqs.submitRfq(created.id);

      Alert.alert(
        'Requirement submitted',
        `Suppliers can now quote on ${quantity} ${unit} of ${values.itemDescription.trim()}.`,
        [
          {
            text: 'View RFQs',
            onPress: () => navigation.replace('RfqList'),
          },
        ],
      );
    } catch {
      Alert.alert(
        'Could not submit',
        'Something went wrong while creating this requirement. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Place a requirement"
        kicker="Request for quotation"
        description="Tell suppliers what you need — for example 1000 kg sugar — and collect competing quotes."
        icon="quote"
        tone="teal"
        onBack={() => navigation.goBack()}
      />

      <Card style={styles.card}>
        <Text variant="bodySmall" color="secondary" style={styles.hint}>
          Example: title “Bulk sugar”, item “Refined sugar”, quantity 1000, unit
          kg.
        </Text>

        <FormTextField
          control={control}
          name="title"
          label="Requirement title"
          placeholder="e.g. Bulk sugar for March"
        />
        <FormTextField
          control={control}
          name="itemDescription"
          label="Product / item needed"
          placeholder="e.g. Sugar, basmati rice, sunflower oil"
        />
        <FormTextField
          control={control}
          name="quantity"
          label="Quantity"
          placeholder="e.g. 1000"
          keyboardType="numeric"
        />

        <View style={styles.unitBlock}>
          <Text variant="label">Unit</Text>
          <View style={styles.units}>
            {UNITS.map(item => (
              <Chip
                key={item}
                label={item}
                selected={unit === item}
                onPress={() => setUnit(item)}
              />
            ))}
          </View>
        </View>

        <FormTextField
          control={control}
          name="deliveryNotes"
          label="Delivery notes (optional)"
          placeholder="Warehouse address, delivery window, packaging"
          multiline
        />
      </Card>

      <Button
        title="Submit to suppliers"
        fullWidth
        size="lg"
        loading={submitting}
        onPress={() => void onSubmit()}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('RfqList')}
        style={styles.link}>
        <Text variant="label" color="accent" align="center">
          View my RFQs
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  hint: {
    marginBottom: spacing[1],
    lineHeight: 20,
  },
  unitBlock: {
    gap: spacing[2],
  },
  units: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  link: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
    paddingVertical: spacing[2],
  },
});
