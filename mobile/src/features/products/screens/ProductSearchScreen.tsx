import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Card,
  Chip,
  EmptyState,
  ErrorState,
  Header,
  Icon,
  LoadingState,
  Screen,
  SearchBar,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {devProductCategories} from '../../../services/api/fixtures';
import {spacing} from '../../../theme/spacing';
import type {Product, ProductCategory} from '../../../types';
import {formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'ProductSearch'>;

export function ProductSearchScreen({navigation, route}: Props) {
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [categoryId, setCategoryId] = useState<string | undefined>(
    route.params?.categoryId,
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appConfig.enableDevPreview) {
      setCategories(devProductCategories);
      return;
    }
    void getAppApi()
      .products.listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await getAppApi().products.listProducts({
        search: query.trim() || undefined,
        categoryId,
        inStockOnly: inStockOnly || undefined,
        page: 1,
        pageSize: 30,
      });
      setItems(page.items);
    } catch (e) {
      setItems([]);
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load products. Backend contract may be pending.',
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId, inStockOnly, query]);

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

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header title="Search products" left={back} />
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search name or SKU"
          onSubmitEditing={() => void load()}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        <Chip
          label="In stock"
          selected={inStockOnly}
          onPress={() => setInStockOnly(prev => !prev)}
        />
        {categories.map(category => (
          <Chip
            key={category.id}
            label={category.name}
            selected={categoryId === category.id}
            onPress={() =>
              setCategoryId(prev =>
                prev === category.id ? undefined : category.id,
              )
            }
          />
        ))}
      </ScrollView>
      {appConfig.enableDevPreview ? (
        <Text variant="caption" color="warning" style={styles.dev}>
          Development preview data when fixtures are enabled
        </Text>
      ) : null}
      {loading ? <LoadingState message="Searching…" /> : null}
      {!loading && error ? (
        <ErrorState title="Search failed" description={error} onRetry={() => void load()} />
      ) : null}
      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No products found"
              description="Try another search, or wait for the product catalogue API contract."
            />
          }
          renderItem={({item}) => (
            <Card
              style={styles.card}
              onPress={() =>
                navigation.navigate('ProductDetails', {productId: item.id})
              }>
              <Text variant="h3">{item.name}</Text>
              <Text variant="caption" color="secondary">
                {item.sku} · MOQ {item.minOrderQuantity} {item.unit}
              </Text>
              <Text variant="label" style={styles.price}>
                {formatMoney(item.price)}
              </Text>
            </Card>
          )}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  searchWrap: {paddingHorizontal: spacing[4], marginBottom: spacing[2]},
  dev: {paddingHorizontal: spacing[4], marginBottom: spacing[2]},
  list: {padding: spacing[4], flexGrow: 1},
  card: {marginBottom: spacing[3]},
  price: {marginTop: spacing[2]},
});
