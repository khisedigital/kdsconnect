import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Header,
  Icon,
  QuantityStepper,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {Product} from '../../../types';
import {formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'ProductDetails'>;

/** DEV fixture only — never used as production live data. */
function getDevProduct(productId: string): Product | null {
  if (!appConfig.enableDevPreview) {
    return null;
  }
  return {
    id: productId,
    sku: 'SKU-DEV-1001',
    name: 'Premium Basmati Rice 25kg',
    description:
      'Long-grain basmati for retail wholesale. Packaging: 25kg woven sack. MOQ applies.',
    categoryId: 'cat-grains',
    unit: 'case',
    minOrderQuantity: 10,
    price: {amount: 1850, currency: 'INR'},
    supplierId: 'sup-1',
    imageUrl: undefined,
    inStock: true,
  };
}

export function ProductDetailsScreen({navigation, route}: Props) {
  const product = useMemo(
    () => getDevProduct(route.params.productId),
    [route.params.productId],
  );
  const [qty, setQty] = useState(product?.minOrderQuantity ?? 1);

  const onRequestQuote = useCallback(() => {
    navigation.navigate('RfqCreate', {productId: route.params.productId});
  }, [navigation, route.params.productId]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={() => navigation.goBack()}>
      <Icon name="chevron" />
    </Pressable>
  );

  if (!product) {
    return (
      <Screen>
        <Header title="Product" left={back} />
        <EmptyState
          title="Product unavailable"
          description={
            appConfig.enableDevPreview
              ? 'No fixture matched this product id.'
              : 'Product details require a confirmed backend product API contract.'
          }
          action={{label: 'Go back', onPress: () => navigation.goBack()}}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="Product details" left={back} />
      {appConfig.enableDevPreview ? (
        <View style={styles.devBanner}>
          <Text variant="caption" color="warning">
            Development fixture — not live catalogue data
          </Text>
        </View>
      ) : null}
      <View style={styles.imageWrap}>
        {product.imageUrl ? (
          <Image source={{uri: product.imageUrl}} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text color="secondary">No image</Text>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <Text variant="h2" style={styles.title}>
          {product.name}
        </Text>
        <Badge
          label={product.inStock ? 'In stock' : 'Out of stock'}
          variant={product.inStock ? 'success' : 'neutral'}
        />
      </View>
      <Text variant="caption" color="secondary">
        SKU {product.sku} · Unit {product.unit} · MOQ {product.minOrderQuantity}
      </Text>
      <Text variant="h1" style={styles.price}>
        {formatMoney(product.price)}
      </Text>
      {product.description ? (
        <Text color="secondary" style={styles.desc}>
          {product.description}
        </Text>
      ) : null}
      <Card style={styles.card}>
        <Text variant="label">Quantity</Text>
        <QuantityStepper
          value={qty}
          min={product.minOrderQuantity}
          max={9999}
          step={1}
          unitLabel={product.unit}
          onChange={setQty}
        />
        <Text variant="caption" color="secondary" style={styles.hint}>
          Minimum order quantity is {product.minOrderQuantity} {product.unit}.
        </Text>
      </Card>
      <Button title="Request quotation" onPress={onRequestQuote} fullWidth />
      <Button
        title="View cart draft"
        variant="outline"
        fullWidth
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('Cart')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  devBanner: {
    backgroundColor: '#B4530922',
    padding: spacing[2],
    borderRadius: radii.md,
    marginBottom: spacing[3],
  },
  imageWrap: {marginBottom: spacing[4]},
  image: {
    width: '100%',
    height: 200,
    borderRadius: radii.lg,
    backgroundColor: colors.border,
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  title: {flex: 1},
  price: {marginTop: spacing[3], marginBottom: spacing[2]},
  desc: {marginBottom: spacing[4]},
  card: {marginBottom: spacing[4], gap: spacing[2]},
  hint: {marginTop: spacing[1]},
  secondaryBtn: {marginTop: spacing[2]},
});
