describe('Filters', () => {
  it('should open filters', () => {
    cy.visit('/tabs/treks');

    cy.get('.vertical-center > :nth-child(1)').click({
      force: true
    });
  });

  it('should add one filter', () => {
    cy.get('.button > span')
      .invoke('text')
      .then((textResultBeforeFilter) => {
        cy.get(
          ':nth-child(2) > .full-width > :nth-child(2) > .no-lines > .in-item'
        ).click({
          force: true
        });
        cy.get('.button > span')
          .invoke('text')
          .should('not.eq', textResultBeforeFilter);
      });
  });

  it('should reset filter', () => {
    cy.get('.button > span')
      .invoke('text')
      .then((textResultBeforeFilter) => {
        cy.get('.none-transform').click({ force: true });

        cy.get('.button > span')
          .invoke('text')
          .should('not.eq', textResultBeforeFilter);
      });
  });

  it('should display filtered treks', () => {
    cy.get(
      ':nth-child(2) > .full-width > :nth-child(2) > .no-lines > .in-item'
    ).click({
      force: true
    });

    cy.get('.button > span')
      .invoke('text')
      .then((textResultBeforeFilter) => {
        cy.get('.footer-md > .button').click({ force: true });
        cy.get('.ion-padding-start.md > .md > h1')
          .invoke('text')
          .then((newResult) => {
            expect(Number(newResult.match(/(\d+)/)[0])).to.be.deep.equal(
              Number(textResultBeforeFilter.match(/(\d+)/)[0])
            );
          });
      });
  });
});
