import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('Cart', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  const mountCart = () => {
    const products = server.createList('product', 2);
    const cartManager = new CartManager();
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
      mocks: {
        $cart: cartManager,
      },
    });

    return { wrapper, products, cartManager };
  };

  it('Should mount the component', () => {
    const { wrapper } = mountCart();

    expect(wrapper.vm).toBeDefined();
  });

  it('Should not display empty cart button when there are no products', () => {
    const { cartManager } = mountCart();

    const wrapper = mount(Cart, {
      mocks: {
        $cart: cartManager,
      },
    });

    expect(wrapper.find('[data-testid="clear-cart-button]').exists()).toBe(
      false
    );
  });

  it('Should emit close event when button gets clicked', async () => {
    const { wrapper } = mountCart();
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toBeDefined();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('Should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart();

    expect(wrapper.classes()).toContain('hidden');
  });

  it('Should display the cart when prop isOpen is passed', async () => {
    const { wrapper } = mountCart();

    await wrapper.setProps({
      isOpen: true,
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('Should display "Cart is empty" when there are not products', async () => {
    const { wrapper } = mountCart();

    wrapper.setProps({
      products: [],
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('Should display 2 instances of CartItem when products are provided', () => {
    const { wrapper } = mountCart();

    const items = wrapper.findAllComponents(CartItem);

    expect(items).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });

  it('Should display a button to clear cart', () => {
    const { wrapper } = mountCart();
    const button = wrapper.find('[data-testid="clear-cart-button"]');

    expect(button.exists()).toBe(true);
  });

  it('Should get default prop when props not provided', () => {
    const cartManager = new CartManager();
    const wrapper = mount(Cart, {
      mocks: {
        $cart: cartManager,
      },
    });

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('Should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager } = mountCart();
    const button = wrapper.find('[data-testid="clear-cart-button"]');
    expect(button.exists()).toBe(true);
    const spy = jest.spyOn(cartManager, 'clearProducts');

    await button.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
