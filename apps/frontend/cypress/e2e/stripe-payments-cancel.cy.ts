describe("Stripe cancel test", function () {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("cancelled");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should redirect to /not-subscribe on login", () => {
    cy.waitForPageLoad("/not-subscribe");
    cy.contains("trial period is over").should("be.visible");
  });

  it("should have access only to payments page", () => {
    cy.visit("/create-project");
    cy.waitForPageLoad("/not-subscribe");
    cy.getBySel("cancel-page-button")
      .should("have.attr", "href", "/settings/payments")
      .click();
    cy.waitForPageLoad("/settings/payments");
  });

  it("verifies payments page content", () => {
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
