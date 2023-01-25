import { getSelect, getChart, getItemInfo, selectOption } from '../support/app.po';

describe('chart', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/stock/').as('getStock');
    cy.intercept('GET', '**/data').as('getData');
    cy.visit('/')
  });

  it('should not display chart witout selected item', () => {
    getChart().should('not.exist');
  });

  it('should not display item details witout selected item', () => {
    getItemInfo().should('not.exist');
  });

  it('should fetch select options', () => {

    cy.wait('@getStock').then((intercept) => {
      const { body } = intercept.response;
      expect(body).to.not.be.null;
    });
  });

  it('should fetch selected chart data', () => {
    selectOption(0)
    cy.wait('@getData').then((intercept) => {
      const { body } = intercept.response;
      expect(body).to.not.be.null;
    });
  });

  it('should show selected stock', () => {
    selectOption(1)
    getSelect().should('exist');
  });

  it('should show selected stock chart', () => {
    selectOption(0)
    getChart().should('exist');
  });

});
