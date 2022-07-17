/// <reference types="cypress" />

import { makeServer } from '../../../miragejs/server';

context('Store', () => {
  let server;
  const g = cy.get;
  const gid = cy.getByTestId;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Should display the store', () => {
    cy.visit('/');

    g('body').contains('Brand');
    g('body').contains('Wrist Watch');
  });

  context.only('Store > Shopping Cart', () => {
    beforeEach(() => {
      server.createList('product', 10);
      cy.visit('/');
    });
    it('Should not display shopping cart when page first loads', () => {
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('Should toggle shopping cart visibility when button is clicked', () => {
      gid('toggle-button').as('toggleButton');
      g('@toggleButton').click();
      gid('shopping-cart').should('not.have.class', 'hidden');

      g('@toggleButton').click({ force: true });
      gid('shopping-cart').should('have.class', 'hidden');
    });

    it('Should open shopping cart when a product is added', () => {
      gid('product-card').first().find('button').click();
      gid('shopping-cart').should('not.have.class', 'hidden');
    });

    it('Should add first product to the cart', () => {
      gid('product-card').first().find('button').click();
      gid('cart-item').should('have.length', 1);
    });

    it('Should add 3 products to the cart', () => {
      gid('product-card').eq(1).find('button').click();
      gid('product-card').eq(3).find('button').click({ force: true });
      gid('product-card').eq(5).find('button').click({ force: true });

      gid('cart-item').should('have.length', 3);
    });
  });

  context('Store > Product List', () => {
    it('Shoul display "0 Products" when no products is returned', () => {
      cy.visit('/');

      gid('product-card').should('have.length', 0);
      g('body').contains('0 Products');
    });

    it('Shoul display "1 Product" when 1 product1 is returned', () => {
      server.create('product', 1);
      cy.visit('/');

      gid('product-card').should('have.length', 1);
      g('body').contains('1 Product');
    });

    it('Shoul display "10 products" when 10 are products is returned', () => {
      server.createList('product', 10);
      cy.visit('/');

      gid('product-card').should('have.length', 10);
      g('body').contains('10 Products');
    });
  });

  context('Store - Search for products', () => {
    it('Should type in the search field', () => {
      cy.visit('/');

      g('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('Should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      });
      server.create('product', 10);

      cy.visit('/');

      g('input[type="search"]').type('Relógio bonito');

      gid('search-form').submit();

      gid('product-card').should('have.length', 1);
    });

    it('Should not return any product', () => {
      server.create('product', 10);

      cy.visit('/');

      g('input[type="search"]').type('Relógio bonito');
      gid('search-form').submit();
      gid('product-card').should('have.length', 0);
      g('body').contains('0 Products');
    });
  });
});
