describe("Stripe active test", function () {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies payment page content", () => {
    cy.visit("/settings/payments");
    cy.waitForPageLoad("/settings/payments");
    cy.contains("You have an active subscription").should("be.visible");
    cy.getBySel("stripe-manage-button").contains("Manage").should("be.enabled");
  });

  it("verifies success page", () => {
    cy.visit("/success");
    cy.getBySel("payment-success-popup").contains("Successful");
    cy.getBySel("move-to-dashboard").click();
    cy.waitForPageLoad("/dashboard");
  });

  it("verifies cancel page", () => {
    cy.visit("/cancel");
    cy.getBySel("payment-cancel-popup").contains("Cancelled");
    cy.getBySel("move-to-dashboard").click();
    cy.waitForPageLoad("/dashboard");
  });
});
