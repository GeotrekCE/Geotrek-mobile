describe('Screenshots', () => {
  const devices = [
    { name: 'phone', width: 412, height: 732 },
    { name: 'tablet', width: 768, height: 1024 }
  ];

  devices.forEach((device) => {
    context(device.name, function() {
      beforeEach(function() {
        cy.viewport(device.width, device.height);
      });

      it('should screenshot treks page', () => {
        cy.visit('/app/tabs/treks');

        cy.wait(10000);

        cy.screenshot(`${device.name}/treks-page`);
      });

      it('should screenshot trek page', () => {
        cy.get(':nth-child(1) > app-trek-card > .extand-card').click({
          force: true
        });

        cy.wait(10000);

        cy.screenshot(`${device.name}/trek-page`);
      });

      it('should screenshot trek map page', () => {
        cy.get(
          '.can-go-back > ion-content.md > .fab-horizontal-end > .no-outline'
        ).click({ force: true });

        cy.wait(10000);

        cy.screenshot(`${device.name}/trek-map-page`);
      });

      it('should screenshot treks map page', () => {
        cy.visit('/app/tabs/treks');
        cy.get('ion-content.md > .fab-horizontal-end > .no-outline').click({
          force: true
        });

        cy.wait(10000);

        cy.screenshot(`${device.name}/treks-map-page`);
      });
    });
  });
});
