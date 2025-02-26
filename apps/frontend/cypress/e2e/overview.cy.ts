describe("Overview test", function () {
  beforeEach(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
    cy.contains('Projects').click()
    cy.waitForSel("project-0", 10000).click();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies overview page with all elements", () => {
    cy.waitForPageLoad("/overview");
    cy.waitForSel("overview-chart", 10000);
  });
});
