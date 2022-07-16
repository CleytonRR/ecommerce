/// <reference types="cypress" />

import { makeServer } from '../../../miragejs/server';

context('Store', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('Should display the store', () => {
    cy.visit('/');

    cy.get('body').contains('Brand');
    cy.get('body').contains('Wrist Watch');
  });

  context.only('Store > Shopping Cart', () => {
    it('Should not display shopping cart when page first loads', () => {
      cy.visit('/');

      cy.get('[data-testid="shopping-cart"]').should('have.class', 'hidden');
    });
  });

  context('Store > Product List', () => {
    it('Shoul display "0 Products" when no products is returned', () => {
      cy.visit('/');

      cy.get('[data-testid="product-card"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });

    it('Shoul display "1 Product" when 1 product1 is returned', () => {
      server.create('product', 1);
      cy.visit('/');

      cy.get('[data-testid="product-card"]').should('have.length', 1);
      cy.get('body').contains('1 Product');
    });

    it('Shoul display "10 products" when 10 are products is returned', () => {
      server.createList('product', 10);
      cy.visit('/');

      cy.get('[data-testid="product-card"]').should('have.length', 10);
      cy.get('body').contains('10 Products');
    });
  });

  context('Store - Search for products', () => {
    it('Should type in the search field', () => {
      cy.visit('/');

      cy.get('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('Should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      });
      server.create('product', 10);

      cy.visit('/');

      cy.get('input[type="search"]').type('Relógio bonito');

      cy.get('[data-testid="search-form"]').submit();

      cy.get('[data-testid="product-card"]').should('have.length', 1);
    });

    it('Should not return any product', () => {
      server.create('product', 10);

      cy.visit('/');

      cy.get('input[type="search"]').type('Relógio bonito');
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="product-card"]').should('have.length', 0);
      cy.get('body').contains('0 Products');
    });
  });
});
