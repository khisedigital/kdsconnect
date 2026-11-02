import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {
  AdminStackParamList,
  RetailerStackParamList,
  SalesStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {SupportQuery, SupportQueryCategory} from '../../../types';
import {formatDate} from '../../../utils/format';
import {useAuth} from '../../auth/AuthContext';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'Support'>
  | NativeStackScreenProps<SupplierStackParamList, 'Support'>
  | NativeStackScreenProps<SalesStackParamList, 'Support'>
  | NativeStackScreenProps<AdminStackParamList, 'Support'>;

const CATEGORIES: {key: SupportQueryCategory; label: string}[] = [
  {key: 'orders', label: 'Orders'},
  {key: 'quotations', label: 'Quotations'},
  {key: 'account', label: 'Account'},
  {key: 'payments', label: 'Payments'},
  {key: 'other', label: 'Other'},
];

const schema = z.object({
  subject: z
    .string()
    .trim()
    .min(4, 'Subject must be at least 4 characters')
    .max(120),
  message: z
    .string()
    .trim()
    .min(10, 'Please describe your query in a bit more detail')
    .max(2000),
});

type FormValues = z.infer<typeof schema>;

function statusVariant(
  status: SupportQuery['status'],
): 'warning' | 'info' | 'success' | 'neutral' {
  switch (status) {
    case 'open':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    default:
      return 'neutral';
  }
}

function statusLabel(status: SupportQuery['status']) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In progress';
    case 'resolved':
      return 'Resolved';
    default:
      return status;
  }
}

export function SupportScreen({navigation}: Props) {
  const {user} = useAuth();
  const isAdmin = user?.role === 'admin';
  const canSendQuery =
    user?.role === 'retailer' ||
    user?.role === 'supplier' ||
    user?.role === 'sales';

  const [category, setCategory] = useState<SupportQueryCategory>('orders');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState<SupportQuery[]>([]);

  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {subject: '', message: ''},
  });

  const loadMine = useCallback(async () => {
    if (!canSendQuery || !appConfig.enableDevPreview) {
      setQueries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await getAppApi().support.listMyQueries({pageSize: 20});
      setQueries(result.items);
    } catch {
      setQueries([]);
    } finally {
      setLoading(false);
    }
  }, [canSendQuery]);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  const onSubmit = handleSubmit(async values => {
    if (busy || !canSendQuery) {
      return;
    }
    if (!appConfig.enableDevPreview) {
      Alert.alert(
        'Backend required',
        'Support queries wait on the confirmed API contract.',
      );
      return;
    }
    setBusy(true);
    try {
      await getAppApi().support.createQuery({
        category,
        subject: values.subject,
        message: values.message,
      });
      reset();
      setCategory('orders');
      await loadMine();
      Alert.alert(
        'Query sent',
        'Admin can see your query now. We will update the status here.',
      );
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Could not send your query. Try again.';
      Alert.alert('Send failed', message);
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen scroll backgroundColor={colors.background}>
      <SubpageHero
        title="Support"
        kicker="Help desk"
        description={
          isAdmin
            ? 'Use Support queries from Account to review retailer and wholesaler messages.'
            : 'Send a query to platform admin. Track status below.'
        }
        icon="support"
        tone="teal"
        onBack={() => navigation.goBack()}
      />

      {canSendQuery ? (
        <Card style={styles.formCard}>
          <Text variant="h3">Send a query</Text>
          <Text variant="bodySmall" color="secondary">
            Admin receives this in their support inbox.
          </Text>
          <View style={styles.chips}>
            {CATEGORIES.map(item => (
              <Chip
                key={item.key}
                label={item.label}
                selected={category === item.key}
                onPress={() => setCategory(item.key)}
              />
            ))}
          </View>
          <FormTextField
            control={control}
            name="subject"
            label="Subject"
            placeholder="Short summary of the issue"
            autoCapitalize="sentences"
          />
          <FormTextField
            control={control}
            name="message"
            label="Details"
            placeholder="What happened? Include order or RFQ IDs if useful."
            multiline
            numberOfLines={4}
            style={styles.messageInput}
          />
          <Button
            title={busy ? 'Sending…' : 'Send query to admin'}
            fullWidth
            size="lg"
            loading={busy}
            onPress={() => void onSubmit()}
          />
        </Card>
      ) : null}

      {canSendQuery ? (
        <>
          <Text variant="label" style={styles.sectionTitle}>
            Your queries
          </Text>
          {loading ? (
            <LoadingState message="Loading your queries…" />
          ) : queries.length === 0 ? (
            <EmptyState
              title="No queries yet"
              description="Send your first query above when you need help from admin."
            />
          ) : (
            queries.map(query => (
              <Card key={query.id} style={styles.queryCard}>
                <View style={styles.queryTop}>
                  <View style={styles.flex}>
                    <Text variant="h3" numberOfLines={2}>
                      {query.subject}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {CATEGORIES.find(c => c.key === query.category)?.label ??
                        query.category}{' '}
                      · {formatDate(query.createdAt)}
                    </Text>
                  </View>
                  <Badge
                    label={statusLabel(query.status)}
                    variant={statusVariant(query.status)}
                  />
                </View>
                <Text variant="bodySmall" color="secondary" numberOfLines={3}>
                  {query.message}
                </Text>
                {query.adminNote ? (
                  <Text variant="caption" color="accent">
                    Admin: {query.adminNote}
                  </Text>
                ) : null}
              </Card>
            ))
          )}
        </>
      ) : (
        <Card style={styles.adminHint}>
          <View style={styles.iconWrap}>
            <Icon name="support" color="primary" size={18} />
          </View>
          <View style={styles.flex}>
            <Text variant="h3">Support inbox</Text>
            <Text variant="bodySmall" color="secondary">
              Open Support queries from Account to catch retailer and wholesaler
              messages.
            </Text>
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: {gap: spacing[3], marginBottom: spacing[4]},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2]},
  messageInput: {minHeight: 110, textAlignVertical: 'top'},
  sectionTitle: {marginBottom: spacing[3]},
  queryCard: {gap: spacing[2], marginBottom: spacing[3]},
  queryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  adminHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
});
