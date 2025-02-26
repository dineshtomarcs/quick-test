describe("Archive user tests ", function () {
  const firstName = "Shashank";
  const lastName = "Jaiswal";
  const email = "shashank@yopmail.com";

  beforeEach(function () {
    cy.clearLocalStorageCache();
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies if we can archive user", () => {
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
    cy.addUser(firstName, lastName, email);
    // cy.visit("/settings/users");
    // cy.waitForPageLoad("/settings/users");
    cy.contains(firstName)
      .parent()
      .within(() => {
        cy.get("td").last().get("span").last().click();
      });
    cy.contains("Are you sure you want to archive the user");
    cy.getBySel("confirm-button").click();
    cy.contains('User archived successfully')
    // cy.visit("/settings/users");
    // cy.waitForPageLoad("/settings/users");
    cy.visit("/archived/users");
    cy.waitForPageLoad("/archived/users");
     cy.contains(firstName, { matchCase:false});
    
  });

  it("verifies if user is reactivated", () => {
    cy.visit("/archived/users");
    cy.waitForPageLoad("/archived/users");
    cy.contains(`${firstName}`, { matchCase: false })
      .parent()
      .parent()
      .within(() => {
        cy.get("td").eq(1).get("button").first().click();
      });
    cy.contains("Are you sure you want to restore the user");
    cy.getBySel("confirm-button").click();
    cy.contains("User reactivated successfully")
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
    cy.contains(firstName, { matchCase: false });
    
  });

  it("verifies if user is deleted permanently", () => {
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
    cy.contains(firstName, { matchCase: false })
      .parent()
      .within(() => {
        cy.get("td").last().get("span").last().click();
      });
    cy.contains("Are you sure you want to archive the user");
    cy.getBySel("confirm-button").click();
    cy.contains('User archived successfully')
    
    cy.visit("/archived/users");
    cy.waitForPageLoad("/archived/users");
    cy.contains(firstName, { matchCase: false })
      .parent()
      .parent()
      .within(() => {
        cy.get("td").eq(1).get("button").last().click();
      });
    cy.contains("Are you sure you want to delete the user");
    cy.getBySel("delete-button").click();
        cy.contains('User deleted successfully')
    cy.waitForPageLoad("/archived/users");
    cy.should("not.contain", firstName);
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
    cy.should("not.contain", firstName);
  });
});
