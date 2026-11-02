import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {Avatar} from '../../../components/ui/Avatar';
import {Badge} from '../../../components/ui/Badge';
import {Card} from '../../../components/ui/Card';
import {Chip} from '../../../components/ui/Chip';
import {EmptyState} from '../../../components/ui/EmptyState';
import {FadeIn} from '../../../components/ui/FadeIn';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {OfferCard} from '../../../components/ui/OfferCard';
import {ProgressBar} from '../../../components/ui/ProgressBar';
import {QuickAction} from '../../../components/ui/QuickAction';
import {Screen} from '../../../components/ui/Screen';
import {SearchBar} from '../../../components/ui/SearchBar';
import {Text} from '../../../components/ui/Text';
import {appConfig} from '../../../config/env';
import {getAppApi} from '../../../services/api/createApi';
import {devProductCategories} from '../../../services/api/fixtures';
import {colors} from '../../../theme/colors';
import {elevation} from '../../../theme/elevation';
import {spacing} from '../../../theme/spacing';
import type {GroupBuyCampaign, Order, Product, Rfq} from '../../../types';
import {formatMoney, greetingForTime} from '../../../utils/format';
import {useAuth} from '../../auth/AuthContext';

type Nav = NativeStackNavigationProp<RetailerStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [campaigns, setCampaigns] = useState<GroupBuyCampaign[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHome = useCallback(async () => {
    setLoading(true);
    try {
      const api = getAppApi();
      const [productPage, rfqList, campaignList, orderList] = await Promise.all([
        api.products.listProducts({page: 1, pageSize: 6}),
        api.rfqs.listRfqs(1, 3),
        api.groupBuying.listCampaigns(1, 3),
        api.orders.listOrders(1, 3),
      ]);
      setProducts(productPage.items);
      setRfqs(rfqList.items);
      setCampaigns(campaignList.items);
      setOrders(orderList.items);
    } catch {
      setProducts([]);
      setRfqs([]);
      setCampaigns([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  const greetingName = user?.businessName ?? user?.displayName ?? 'there';
  const categories = appConfig.enableDevPreview ? devProductCategories : [];

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
        <FadeIn>
          <View style={styles.topBar}>
            <View style={styles.identity}>
              <Avatar name={greetingName} size="md" />
              <View style={styles.identityCopy}>
                <Text variant="caption" color="secondary">
                  {greetingForTime()}
                </Text>
                <Text variant="h2" numberOfLines={1}>
                  {greetingName}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => navigation.navigate('Notifications')}
              style={({pressed}) => [
                styles.bell,
                elevation[1],
                pressed && styles.pressed,
              ]}>
              <Icon name="bell" color="primary" />
            </Pressable>
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <View style={[styles.hero, elevation[2]]}>
            <View style={styles.heroOrb} />
            <Text variant="caption" color="inverse" style={styles.heroKicker}>
              KDS Wholesale Connect
            </Text>
            <Text variant="h1" color="inverse" style={styles.heroTitle}>
              Source smarter.{'\n'}Buy with confidence.
            </Text>
            <Text variant="bodySmall" color="inverse" style={styles.heroBody}>
              Compare quotations, join group buys, and keep fulfilment visible.
            </Text>
          </View>
        </FadeIn>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products, SKUs, suppliers…"
          onSubmitEditing={() =>
            navigation.navigate('ProductSearch', {
              query: searchQuery || undefined,
            })
          }
        />

        <View style={styles.actions}>
          <QuickAction
            label="RFQs"
            icon="quote"
            tone="teal"
            onPress={() => navigation.navigate('RfqList')}
          />
          <QuickAction
            label="Cart"
            icon="cart"
            tone="copper"
            onPress={() => navigation.navigate('Cart')}
          />
          <QuickAction
            label="Group buy"
            icon="group"
            tone="mist"
            onPress={() =>
              navigation.navigate('RetailerTabs', {screen: 'GroupBuying'})
            }
          />
          <QuickAction
            label="Orders"
            icon="orders"
            tone="teal"
            onPress={() =>
              navigation.navigate('RetailerTabs', {screen: 'Orders'})
            }
          />
        </View>

        {categories.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}>
            {categories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                selected={false}
                onPress={() =>
                  navigation.navigate('ProductSearch', {
                    categoryId: category.id,
                  })
                }
              />
            ))}
          </ScrollView>
        ) : null}

        {loading ? (
          <LoadingState message="Loading your wholesale dashboard…" />
        ) : (
          <>
            <Section
              title="Featured offers"
              actionLabel="See all"
              onAction={() =>
                navigation.navigate('RetailerTabs', {screen: 'Products'})
              }>
              {products.length === 0 ? (
                <EmptyState
                  title="No offers yet"
                  description="Browse the catalog to discover supplier pricing."
                  action={{
                    label: 'Browse products',
                    onPress: () =>
                      navigation.navigate('RetailerTabs', {screen: 'Products'}),
                  }}
                />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.offerRail}>
                  {products.map(product => (
                    <OfferCard
                      key={product.id}
                      railWidth={220}
                      title={product.name}
                      subtitle={product.sku}
                      priceLabel={formatMoney(product.price)}
                      meta={`MOQ ${product.minOrderQuantity}`}
                      badge={product.inStock ? 'In stock' : undefined}
                      onPress={() =>
                        navigation.navigate('ProductDetails', {
                          productId: product.id,
                        })
                      }
                    />
                  ))}
                </ScrollView>
              )}
            </Section>

            <Section title="Active group buys">
              {campaigns.length === 0 ? (
                <EmptyState
                  title="No group buys"
                  description="Check back for volume discounts."
                />
              ) : (
                campaigns.map(campaign => (
                  <Card
                    key={campaign.id}
                    padding="md"
                    onPress={() =>
                      navigation.navigate('GroupBuyDetails', {
                        campaignId: campaign.id,
                      })
                    }
                    style={styles.campaignCard}>
                    <View style={styles.campaignTop}>
                      <Text variant="h3" style={styles.flex}>
                        {campaign.title}
                      </Text>
                      <Badge label={campaign.status} variant="info" />
                    </View>
                    <Text variant="caption" color="secondary">
                      {formatMoney(campaign.unitPrice)} per unit
                    </Text>
                    <ProgressBar
                      current={campaign.currentQuantity}
                      target={campaign.targetQuantity}
                      label="Progress"
                    />
                  </Card>
                ))
              )}
            </Section>

            <Section
              title="Open RFQs"
              actionLabel="View all"
              onAction={() => navigation.navigate('RfqList')}>
              {rfqs.length === 0 ? (
                <EmptyState
                  title="No RFQs"
                  description="Request quotations when you are ready."
                  action={{
                    label: 'Create RFQ',
                    onPress: () => navigation.navigate('RfqCreate', undefined),
                  }}
                />
              ) : (
                rfqs.map(rfq => (
                  <Card
                    key={rfq.id}
                    padding="md"
                    onPress={() =>
                      navigation.navigate('RfqDetails', {rfqId: rfq.id})
                    }
                    style={styles.listCard}>
                    <View style={styles.listRow}>
                      <View style={styles.flex}>
                        <Text variant="h3">{rfq.title}</Text>
                        <Text variant="caption" color="secondary">
                          {rfq.items.length} line item(s)
                        </Text>
                      </View>
                      <Badge label={rfq.status} variant="neutral" />
                    </View>
                  </Card>
                ))
              )}
            </Section>

            <Section title="Recent orders">
              {orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Orders you place will appear here."
                />
              ) : (
                orders.map(order => (
                  <Card
                    key={order.id}
                    padding="md"
                    onPress={() =>
                      navigation.navigate('OrderDetails', {orderId: order.id})
                    }
                    style={styles.listCard}>
                    <View style={styles.listRow}>
                      <View style={styles.flex}>
                        <Text variant="h3">Order #{order.id.slice(-6)}</Text>
                        <Text variant="caption" color="secondary">
                          {order.status}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  identityCopy: {
    flex: 1,
    gap: 2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: spacing[5],
    overflow: 'hidden',
    minHeight: 168,
    justifyContent: 'flex-end',
    gap: spacing[2],
  },
  heroOrb: {
    position: 'absolute',
    top: -36,
    right: -24,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.brand.light,
    opacity: 0.35,
  },
  heroKicker: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroTitle: {
    maxWidth: 280,
  },
  heroBody: {
    opacity: 0.88,
    maxWidth: 300,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  chips: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  section: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerRail: {
    paddingRight: spacing[2],
  },
  campaignCard: {
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  campaignTop: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'flex-start',
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
