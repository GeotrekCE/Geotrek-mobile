describe('More', () => {
  it('should go to more tab', () => {
    cy.visit('/tabs/more');
  });

  it('should got items', () => {
    cy.get('.list-md')
      .children()
      .should('have.length.greaterThan', 0);
  });

  it('should go to one item', () => {
    cy.get('.list-md > :nth-child(1)').click({ force: true });
    cy.url().should('include', '/more/');
  });
});
