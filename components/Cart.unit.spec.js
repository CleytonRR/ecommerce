import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';

describe('Cart', () => {
  it('Should mount the component', () => {
    const wrapper = mount(Cart);

    expect(wrapper.vm).toBeDefined();
  });
});
