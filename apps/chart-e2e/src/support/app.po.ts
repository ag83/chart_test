export const getSelect = () => cy.get('.stock-select');

export const getChart = () => cy.get('.stock-chart-wrapper svg');

export const getItemInfo = () => cy.get('.stock-selected-wrapper');

export const selectOption = (optionNumber: number) => {
    cy.wait('@getStock');
    getSelect().get('[class*="-control"]').click(0, 0, { force: true })
        .get('[class*="-menu"]')
        .find('[class*="-option"]')
        .eq(optionNumber)
        .click(0, 0, { force: true });


}
