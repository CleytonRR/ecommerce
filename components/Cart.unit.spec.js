import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

describe('Cart', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Should mount the component', () => {
    const wrapper = mount(Cart);

    expect(wrapper.vm).toBeDefined();
  });

  it('Should emit close event when button gets clicked', async () => {
    const wrapper = mount(Cart);
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toBeDefined();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('Should hide the cart when no prop isOpen is passed', () => {
    const wrapper = mount(Cart);

    expect(wrapper.classes()).toContain('hidden');
  });

  it('Should display the cart when prop isOpen is passed', () => {
    const wrapper = mount(Cart, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('Should display "Cart is empty" when there are not products', () => {
    const wrapper = mount(Cart);

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('Should display 2 instances of CartItem when products are provided', () => {
    const products = server.createList('product', 2);
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
    });

    const items = wrapper.findAllComponents(CartItem);

    expect(items).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });
});
