describe("Stripe free trial test", function () {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("freeTrial");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should show trial popup on login only", () => {
    cy.getBySel("free-trial-popup").should("be.visible");
    cy.getBySel("free-trial-subscribe-btn")
      .contains("Subscribe")
      .should("be.enabled")
      .click();
    cy.waitForPageLoad("/settings/payments");
    cy.visit("/dashboard");
    cy.waitForPageLoad("/dashboard");
    cy.getBySel("free-trial-popup").should("not.exist");
  });

  it("verifies payments page and its contents", () => {
    cy.visit("/settings/payments");
    cy.waitForPageLoad("/settings/payments");
    cy.contains(
      "You haven't selected any payment plan. To continue using the product you need to subscribe to a plan."
    ).should("be.visible");
    cy.get("#stripe-checkout-button")
      .contains("Subscribe")
      .should("be.enabled");
  });
});
