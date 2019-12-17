describe('Screenshots', () => {
  const devices = [
    { name: 'phone', width: 412, height: 732 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1024, height: 768 }
  ];

  devices.forEach((device) => {
    context(device.name, function() {
      beforeEach(function() {
        cy.viewport(device.width, device.height);
      });

      it('should screenshot treks page', () => {
        cy.visit('/app/tabs/treks');

        for (let i = 1; i <= 4; i++) {
          cy.get(
            `:nth-child(${i}) > app-trek-card > .extand-card > .card-native > :nth-child(2) > .min-size-img`
          ).should('exist');
        }

        cy.screenshot(`${device.name}/treks-page`);
      });

      it('should screenshot trek page', () => {
        cy.get(':nth-child(1) > app-trek-card > .extand-card').click({
          force: true
        });
        cy.url().should('include', '/trek-details');

        cy.get(
          '[style="align-items: center; display: flex; flex-direction: column; justify-content: center;"] > .md'
        ).should('exist');

        cy.screenshot(`${device.name}/trek-page`);
      });

      it('should screenshot trek map page', () => {
        cy.get(
          '.can-go-back > ion-content.md > .fab-horizontal-end > .no-outline'
        ).click({ force: true });
        cy.url().should('include', '/map');

        cy.get('.loader-container').should('exist');
        cy.get('.loader-container').should('not.exist');

        cy.get('#map-trek')
          .then((elt) => Promise.resolve(elt[0].mapInstance))
          .as('mapinstance');
        cy.get('@mapinstance', { timeout: 15000 }).should((mapElt) => {
          mapElt.resize();
          expect(mapElt.areTilesLoaded()).to.be.true;
        });

        // delay to display cluster text
        cy.wait(1000);

        cy.screenshot(`${device.name}/trek-map-page`);
      });

      it('should screenshot treks map page', () => {
        cy.visit('/app/tabs/treks/treks-map');

        cy.get('.loader-container').should('exist');
        cy.get('.loader-container').should('not.exist');

        cy.get('#map-treks')
          .then((elt) => Promise.resolve(elt[0].mapInstance))
          .as('mapinstance');
        cy.get('@mapinstance', { timeout: 15000 }).should((mapElt) => {
          mapElt.resize();
          expect(mapElt.areTilesLoaded()).to.be.true;
        });

        // delay to display cluster text
        cy.wait(1000);

        cy.screenshot(`${device.name}/treks-map-page`);
      });
    });
  });
});
