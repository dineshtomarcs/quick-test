describe("Jira integration", () => {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.intercept(/\/plugins\/config/).as("pluginConfig");
    cy.visit("/settings/integrations");
    cy.wait("@pluginConfig");
    cy.waitForSel("jira-configure-btn", 10000);
    cy.getBySel("jira-configure-btn").click();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {
    // Reconfigure the plugin with API token#2
    const payload = {
      accessToken: Cypress.env("jiraApiTokenTwo"),
      webAddress: Cypress.env("jiraOrgAddress"),
      userName: Cypress.env("jiraUserEmail"),
    };
    cy.updateJiraConfig(payload);
  });

  const randomApiKey = "7t872edahdbad7r479ahd";

  it("should not allow configuring/re-configuring with invalid credentials", () => {
    cy.get('input[name="apiToken"]').clear();
    cy.get('input[name="apiToken"]').type(randomApiKey);
    cy.get("#submit-button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Plugin credentials are invalid',);
    });


    // cy.contains("invalid").should("be.visible");
  });

  it("should configure/re-configure jira plugin", () => {
    cy.get('input[name="orgAddress"]').clear();
    cy.get('input[name="orgAddress"]').type(Cypress.env("jiraOrgAddress"));
    cy.get('input[name="userEmail"]').clear();
    cy.get('input[name="userEmail"]').type(Cypress.env("jiraUserEmail"));
    cy.get('input[name="apiToken"]').clear();
    cy.get('input[name="apiToken"]').type(Cypress.env("jiraApiTokenOne"));

    cy.get("#submit-button").click();
    cy.contains("successfully").should("be.visible");
  });
});
