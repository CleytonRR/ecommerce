import { mount } from '@vue/test-utils';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('CartItem', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  const mountCartItem = () => {
    const cartManager = new CartManager();

    const product = server.create('product', {
      title: 'Lindo relogio',
      price: '22.33',
    });
    const wrapper = mount(CartItem, {
      propsData: {
        product,
      },
      mocks: {
        $cart: cartManager,
      },
    });

    return { wrapper, product, cartManager };
  };

  it('Should mount the component', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });

  it('Should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem();

    const content = wrapper.text();

    expect(content).toContain(title);
    expect(content).toContain(price);
  });

  it('Should display quantity 1 when product ios first displayed', () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('[data-testid="quantity"]');

    expect(quantity.text()).toContain('1');
  });

  it('Should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="+"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('2');
    await button.trigger('click');
    expect(quantity.text()).toContain('3');
    await button.trigger('click');
    expect(quantity.text()).toContain('4');
  });

  it('Should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('Should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('Should display a button to remove item from cart', () => {
    const { wrapper } = mountCartItem();
    const button = wrapper.find('[data-testid="remove-button"]');
    // const spy = jest.spyOn(cartManager, 'removeProduct');

    expect(button.exists()).toBe(true);
  });

  it('Should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager, product } = mountCartItem();
    const button = wrapper.find('[data-testid="remove-button"]');
    const spy = jest.spyOn(cartManager, 'removeProduct');

    await button.trigger('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product.id);
  });
});
