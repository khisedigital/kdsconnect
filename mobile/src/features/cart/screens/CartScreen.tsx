import React, {useMemo, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RetailerStackParamList} from '../../../app/navigation/types';
import {
  useAppDispatch,
  useAppSelector,
  clearCart,
  removeCartItem,
  updateCartItem,
} from '../../../app/store';
import {
  Button,
  EmptyState,
  Header,
  Icon,
  QuantityStepper,
  Screen,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {colors} from '../../../theme/colors';
import {spacing} from '../../../theme/spacing';
import {formatMoney} from '../../../utils/format';

type Props = NativeStackScreenProps<RetailerStackParamList, 'Cart'>;

export function CartScreen({navigation}: Props) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = useMemo(() => {
    const amount = items.reduce(
      (sum, item) => sum + item.unitPrice.amount * item.quantity,
      0,
    );
    return {amount, currency: items[0]?.unitPrice.currency ?? 'INR'};
  }, [items]);

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
      hitSlop={8}>
      <Icon name="chevronLeft" />
    </Pressable>
  );

  const onSubmit = async () => {
    if (submitting || items.length === 0) {
      return;
    }
    setSubmitting(true);
    try {
      Alert.alert(
        'Order submission',
        appConfig.enableDevPreview
          ? 'Cart draft is local only. Order create requires a confirmed backend contract and is not executed in production mode from fixtures.'
          : 'Order create API contract is not confirmed. No order was submitted.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <Header title="Cart draft" left={back} />
      <Text variant="caption" color="secondary" style={styles.note}>
        Cart is a local draft. Tokens are never stored here. Order placement
        requires backend authorization.
      </Text>
      <FlatList
        data={items}
        keyExtractor={item => item.productId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="Cart is empty"
            description="Add products from the catalogue to build a draft order."
            action={{
              label: 'Browse products',
              onPress: () => navigation.navigate('RetailerTabs', {screen: 'Products'}),
            }}
          />
        }
        renderItem={({item}) => (
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text variant="h3">{item.productName}</Text>
              <Text color="secondary">{formatMoney(item.unitPrice)}</Text>
              <QuantityStepper
                value={item.quantity}
                min={1}
                max={9999}
                onChange={value =>
                  dispatch(
                    updateCartItem({productId: item.productId, quantity: value}),
                  )
                }
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove item"
              onPress={() =>
                dispatch(removeCartItem({productId: item.productId}))
              }>
              <Icon name="close" color="secondary" />
            </Pressable>
          </View>
        )}
      />
      {items.length > 0 ? (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text variant="label">Subtotal</Text>
            <Text variant="h3">{formatMoney(subtotal)}</Text>
          </View>
          <Button
            title="Submit order"
            fullWidth
            loading={submitting}
            onPress={onSubmit}
          />
          <Button
            title="Clear cart"
            variant="ghost"
            fullWidth
            onPress={() => dispatch(clearCart())}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {paddingHorizontal: spacing[4], marginBottom: spacing[2]},
  list: {padding: spacing[4], flexGrow: 1},
  row: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  flex: {flex: 1, gap: spacing[2]},
  footer: {
    padding: spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing[2],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
});
