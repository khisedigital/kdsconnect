import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {Badge} from '../../../components/ui/Badge';
import {Card} from '../../../components/ui/Card';
import {EmptyState} from '../../../components/ui/EmptyState';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {Order, Rfq} from '../../../types';
import {formatMoney} from '../../../utils/format';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<SupplierStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingRfqs, setPendingRfqs] = useState(0);
  const [openOrders, setOpenOrders] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const api = getAppApi();
      const [summary, rfqList, orderList] = await Promise.all([
        api.supplier.getDashboard(),
        api.rfqs.listRfqs(1, 3),
        api.supplier.listSupplierOrders(1, 3),
      ]);
      setPendingRfqs(summary.pendingRfqs);
      setOpenOrders(summary.openOrders);
      setActiveProducts(summary.activeProducts);
      setRfqs(rfqList.items);
      setOrders(orderList.items);
    } catch {
      setPendingRfqs(0);
      setOpenOrders(0);
      setActiveProducts(0);
      setRfqs([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.screenInner}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + spacing[2]},
        ]}>
        <TabPageHeader
          kicker="Supplier workspace"
          title="Dashboard"
          description={
            user?.businessName
              ? `Monitor RFQs, fulfilment, and catalog health for ${user.businessName}.`
              : 'Monitor incoming RFQs, open orders, and catalog performance.'
          }>
          <FadeIn delay={80}>
            <View style={styles.metrics}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('SupplierTabs', {screen: 'Rfqs'})
                }
                style={styles.metricCard}>
                <Icon name="quote" color="accent" size={18} />
                <Text variant="h2">{pendingRfqs}</Text>
                <Text variant="caption" color="secondary">
                  Pending RFQs
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('SupplierTabs', {screen: 'Orders'})
                }
                style={styles.metricCard}>
                <Icon name="orders" color="primary" size={18} />
                <Text variant="h2">{openOrders}</Text>
                <Text variant="caption" color="secondary">
                  Open orders
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('SupplierTabs', {screen: 'Products'})
                }
                style={styles.metricCard}>
                <Icon name="products" color="primary" size={18} />
                <Text variant="h2">{activeProducts}</Text>
                <Text variant="caption" color="secondary">
                  Listed SKUs
                </Text>
              </Pressable>
            </View>
          </FadeIn>
        </TabPageHeader>

        {loading ? (
          <LoadingState message="Loading supplier metrics…" />
        ) : (
          <>
            <Section
              title="RFQs needing response"
              actionLabel="All RFQs"
              onAction={() =>
                navigation.navigate('SupplierTabs', {screen: 'Rfqs'})
              }>
              {rfqs.length === 0 ? (
                <EmptyState
                  title="Queue is clear"
                  description="New retailer quotation requests will show here for you to quote."
                />
              ) : (
                rfqs.map(rfq => (
                  <Card
                    key={rfq.id}
                    padding="md"
                    onPress={() =>
                      navigation.navigate('SupplierRfqDetails', {
                        rfqId: rfq.id,
                      })
                    }
                    style={styles.listCard}>
                    <View style={styles.listRow}>
                      <View style={styles.flex}>
                        <Text variant="h3">{rfq.title}</Text>
                        <Text variant="caption" color="secondary">
                          {rfq.items.length} line item(s) · quote to compete
                        </Text>
                      </View>
                      <Badge label={rfq.status} variant="neutral" />
                    </View>
                  </Card>
                ))
              )}
            </Section>

            <Section
              title="Orders to fulfil"
              actionLabel="All orders"
              onAction={() =>
                navigation.navigate('SupplierTabs', {screen: 'Orders'})
              }>
              {orders.length === 0 ? (
                <EmptyState
                  title="No open fulfilment"
                  description="Orders from awarded quotations appear here for packing and shipping."
                />
              ) : (
                orders.map(order => (
                  <Card
                    key={order.id}
                    padding="md"
                    onPress={() =>
                      navigation.navigate('SupplierOrderDetails', {
                        orderId: order.id,
                      })
                    }
                    style={styles.listCard}>
                    <View style={styles.listRow}>
                      <View style={styles.flex}>
                        <Text variant="h3">Order #{order.id.slice(-6)}</Text>
                        <Text variant="caption" color="secondary">
                          {order.status} · fulfil & update status
                        </Text>
                      </View>
                      <Text variant="label" color="accent">
                        {formatMoney(order.total)}
                      </Text>
                    </View>
                  </Card>
                ))
              )}
            </Section>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="h3">{title}</Text>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} accessibilityRole="button">
            <Text variant="label" color="accent">
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screenInner: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scroll: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[4],
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  metricCard: {
    ...cardShellElevated,
    flex: 1,
    padding: spacing[4],
    gap: spacing[1],
  },
  section: {
    gap: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listCard: {
    marginBottom: spacing[2],
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  flex: {
    flex: 1,
  },
});
