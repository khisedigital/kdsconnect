import cartReducer, {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
} from '../../src/app/store/slices/cartSlice';

describe('cartSlice', () => {
  const item = {
    productId: 'p1',
    productName: 'Rice',
    quantity: 2,
    unitPrice: {amount: 100, currency: 'INR'},
  };

  it('adds and merges quantities', () => {
    let state = cartReducer(undefined, addCartItem(item));
    state = cartReducer(state, addCartItem({...item, quantity: 3}));
    expect(state.items[0].quantity).toBe(5);
  });

  it('updates and removes items', () => {
    let state = cartReducer(undefined, addCartItem(item));
    state = cartReducer(
      state,
      updateCartItem({productId: 'p1', quantity: 1}),
    );
    expect(state.items[0].quantity).toBe(1);
    state = cartReducer(state, removeCartItem({productId: 'p1'}));
    expect(state.items).toHaveLength(0);
  });

  it('clears cart', () => {
    let state = cartReducer(undefined, addCartItem(item));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
