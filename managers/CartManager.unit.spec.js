import { CartManager } from '@/managers/CartManager';

describe('CartManager', () => {
  it('Should set cart to open', () => {
    const manager = new CartManager();

    const state = manager.open();

    expect(state.open).toBe(true);
  });

  it('Should set cart to closed', () => {
    const manager = new CartManager();

    const state = manager.close();

    expect(state.open).toBe(false);
  });

  it.todo('Should add product to the cart only once');

  it.todo('Should remove product from the cart');

  it.todo('Should clear products');

  it.todo('should return true if cart is not empty');

  it.todo('Should return true if product is already in the cart');
});
