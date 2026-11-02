import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {EmptyState} from '../../../components/ui/EmptyState';
import {LoadingState} from '../../../components/ui/LoadingState';
import {OfferCard} from '../../../components/ui/OfferCard';
import {Screen} from '../../../components/ui/Screen';
import {SearchBar} from '../../../components/ui/SearchBar';
import {Text} from '../../../components/ui/Text';
import {getAppApi} from '../../../services/api/createApi';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import type {Product} from '../../../types';
import {formatMoney} from '../../../utils/format';

type Nav = NativeStackNavigationProp<RetailerStackParamList>;

export function ProductsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAppApi().products.listProducts({
        page: 1,
        pageSize: 50,
        search: query.trim() || undefined,
      });
      setProducts(result.items);
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
      <View style={[styles.header, {paddingTop: insets.top + spacing[2]}]}>
        <Text variant="caption" color="secondary" style={styles.kicker}>
          Catalogue
        </Text>
        <Text variant="h1">Products</Text>
        <Text variant="bodySmall" color="secondary">
          Wholesale inventory with MOQ-aware pricing.
        </Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search name or SKU"
          onSubmitEditing={() => void load()}
        />
      </View>
      {loading ? (
        <LoadingState message="Loading products…" />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try another search or check back when suppliers publish catalogs."
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <View style={styles.cell}>
              <OfferCard
                title={item.name}
                subtitle={item.sku}
                priceLabel={formatMoney(item.price)}
                meta={`${item.unit} · MOQ ${item.minOrderQuantity}`}
                badge={item.inStock ? 'In stock' : undefined}
                onPress={() =>
                  navigation.navigate('ProductDetails', {productId: item.id})
                }
              />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  header: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  kicker: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing[12],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  cell: {
    width: '48%',
  },
});
