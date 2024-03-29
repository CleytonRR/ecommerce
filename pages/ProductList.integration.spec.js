import { mount } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import Search from '@/components/Search';
import ProductList from '.';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  const getProducts = (quantity = 10, overrides = []) => {
    let overrideList = [];

    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      );
    }
    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ];

    return products;
  };

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = getProducts(quantity, overrides);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    return { wrapper, products };
  };

  it('Should mount the component', async () => {
    const { wrapper } = await mountProductList();

    expect(wrapper.vm).toBeDefined();
  });

  it('Should mount the Search component as a child', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('Should call axios.get on component mount', async () => {
    await mountProductList();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('Should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList();
    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('Should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList(10, [], true);
    expect(wrapper.text()).toContain('Problemas ao carregar a lista');
  });

  it('Should filter the product list when a search is perfomed', async () => {
    // Arrange
    const overrides = [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu relógio estimado',
      },
    ];
    const { wrapper } = await mountProductList(10, overrides);

    // Act
    const search = wrapper.findComponent(Search);
    await search.find('input[type="search"]').setValue('relógio');

    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });

  it('Should filter the product list when a search is perfomed', async () => {
    // Arrange
    const overrides = [
      {
        title: 'Meu relógio amado',
      },
    ];

    const { wrapper } = await mountProductList(10, overrides);
    // Act
    const search = wrapper.findComponent(Search);
    await search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    await search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('');
    expect(cards).toHaveLength(11);
  });

  it('Should display the total quantity of products', async () => {
    const { wrapper } = await mountProductList(27);

    const label = wrapper.find('[data-testid="total-quantity-label"]');
    expect(label.exists()).toBe(true);
    expect(label.text()).toEqual('27 Products');
  });

  it('Should display product (singular) when there is only 1 product', async () => {
    const { wrapper } = await mountProductList(1);

    const label = wrapper.find('[data-testid="total-quantity-label"]');
    expect(label.text()).toEqual('1 Product');
  });
});
