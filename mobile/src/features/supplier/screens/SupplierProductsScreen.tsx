import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {SupplierStackParamList} from '../../../app/navigation/types';
import {Badge} from '../../../components/ui/Badge';
import {EmptyState} from '../../../components/ui/EmptyState';
import {Icon} from '../../../components/ui/Icon';
import {LoadingState} from '../../../components/ui/LoadingState';
import {Screen} from '../../../components/ui/Screen';
import {SearchBar} from '../../../components/ui/SearchBar';
import {TabPageHeader} from '../../../components/ui/TabPageHeader';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {cardShellElevated} from '../../../theme/surfaces';
import type {Product} from '../../../types';
import {formatMoney} from '../../../utils/format';

type Nav = NativeStackNavigationProp<SupplierStackParamList>;

export function SupplierProductsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().supplier.listSupplierProducts(1, 50);
      const trimmed = query.trim().toLowerCase();
      const items = trimmed
        ? result.items.filter(
            item =>
              item.name.toLowerCase().includes(trimmed) ||
              item.sku.toLowerCase().includes(trimmed),
          )
        : result.items;
      setProducts(items);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen
      edges={['left', 'right']}
      backgroundColor={colors.background}
      contentContainerStyle={styles.inner}>
      <FlatList
        data={loading ? [] : products}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          {paddingTop: insets.top + spacing[2]},
        ]}
        ListHeaderComponent={
          <TabPageHeader
            kicker="Your catalog"
            title="Products"
            description="Manage SKUs, wholesale pricing, and stock visibility for retailers.">
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search SKU or product name"
              onSubmitEditing={() => void load()}
            />
          </TabPageHeader>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState message="Loading catalog…" />
          ) : (
            <EmptyState
              title="No products listed"
              description="Publish SKUs so retailers can request quotes and place orders."
            />
          )
        }
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('SupplierProductDetails', {
                productId: item.id,
              })
            }
            style={({pressed}) => [
              styles.productCard,
              pressed && styles.pressed,
            ]}>
            <View style={styles.iconBubble}>
              <Icon name="products" color="primary" size={16} />
            </View>
            <View style={styles.flex}>
              <Text variant="h3" numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="caption" color="secondary">
                {item.sku} · MOQ {item.minOrderQuantity} {item.unit}
              </Text>
              <Text variant="label" color="accent" style={styles.price}>
                {formatMoney(item.price)}
              </Text>
            </View>
            <View style={styles.trailing}>
              <Badge
                label={item.inStock ? 'In stock' : 'Out'}
                variant={item.inStock ? 'success' : 'neutral'}
              />
              <Icon name="chevronRight" color="secondary" size={14} />
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
    gap: spacing[3],
  },
  productCard: {
    ...cardShellElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
  },
  pressed: {
    opacity: 0.94,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    gap: 2,
  },
  price: {
    marginTop: spacing[1],
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
});
