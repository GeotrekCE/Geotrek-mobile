describe('Search', () => {
  it('should open search', () => {
    cy.visit('/tabs/treks');

    cy.get('.vertical-center > :nth-child(2)').click({
      force: true
    });
  });

  it('should search', () => {
    cy.get('ion-content.md > .list-md')
      .children()
      .should('have.length.greaterThan', 0);

    cy.get('.searchbar-input').should('be.visible');

    cy.get('.searchbar-input').type('no-result-trek-search',{force:true});

    cy.get('#ion-overlay-1 > .ion-page > .content-ltr > .list-md').should("not.exist")
    
    cy.get('.searchbar-input').clear();
  });

  it('should go to trek from search', () => {
    cy.get('#ion-overlay-1 > .ion-page > .content-ltr > .list-md > :nth-child(1)').click({
      force: true
    });

    cy.url().should('include', '/trek-details');
  });
});
