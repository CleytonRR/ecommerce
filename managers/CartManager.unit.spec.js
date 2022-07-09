import { CartManager } from '@/managers/CartManager';
import { makeServer } from '@/miragejs/server';

describe('CartManager', () => {
  let server;
  const manager = new CartManager();
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Should set cart to open', () => {
    const state = manager.open();

    expect(state.open).toBe(true);
  });

  it('Should set cart to closed', () => {
    const state = manager.close();

    expect(state.open).toBe(false);
  });

  it('Should add product to the cart only once', () => {
    const product = server.create('product');

    manager.addProduct(product);
    const state = manager.addProduct(product);

    expect(state.items).toHaveLength(1);
  });

  it('Should remove product from the cart', () => {
    const product = server.create('product');

    const state = manager.removeProduct(product.id);

    expect(state.items).toHaveLength(0);
  });

  it('Should clear products', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    manager.addProduct(product1);
    manager.addProduct(product2);

    const state = manager.clearProducts();

    expect(state.items).toHaveLength(0);
  });

  it('Should clear cart', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    manager.addProduct(product1);
    manager.addProduct(product2);

    const state = manager.clearCart();

    expect(state.items).toHaveLength(0);
    expect(state.open).toBe(false);
  });

  it('should return true if cart is not empty', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    manager.addProduct(product1);
    manager.addProduct(product2);

    expect(manager.hasProducts()).toBe(true);
  });

  it('Should return true if product is already in the cart', () => {
    const product = server.create('product');

    manager.addProduct(product);

    expect(manager.productIsInTheCart(product)).toBeTruthy();
  });
});
