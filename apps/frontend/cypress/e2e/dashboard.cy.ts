describe("Dashboard test", () => {
  beforeEach(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
    const projectName = `Test Dashboard - ${Cypress._.now()}`;
    cy.addProject(projectName).as("projectId");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should verify all the elements in the Dashboard page", () => {
    cy.location("pathname").should("eq", "/dashboard");
    cy.contains("QUICK TEST").should("be.visible");
    cy.waitForSel("profile-menu", 10000).should("be.visible");
    cy.getBySel("input-search-box").should("be.visible");
   
  });
  

  // it("verifies the click functionality of three dot menu In the projects listing", () => {
  //   cy.getBySelLike('three-dots-menu').first().click();
  //  debugger
  //  // cy.get('[data-cy=three-dots-menu-0]').click()

  //   cy.contains("Edit");
  //   cy.contains("View");
  //   cy.contains("Archive").click();
    
  // });

  // it("should delete section", () => {
  //   cy.getBySelLike("three-dots-menu").first().click();
  //   cy.contains("Archive").click();
  //   cy.getBySel("confirm-button").click();
  //   cy.contains("Project archived successfully");
  // });

  // it("verifies favoriting and unfavoriting projects", function () {
  //   cy.getBySelLike("add-favorite").first().click();

  //   cy.getBySelLike("favorite-project")
  //     .first()
  //     .within(() => {
  //       cy.contains("Overview").should("be.visible");
  //       cy.contains("Todos").should("be.visible");
  //       cy.contains("Milestones").should("be.visible");
  //       cy.contains("Test Cases").should("be.visible");
  //       cy.contains("Test Runs").should("be.visible");
  //     });

  //   cy.getBySelLike("remove-favorite").first().click();

  //   cy.deleteProject(this.projectId);
  // });
  

  // it("should verify all the elements in the header", () => {
  //   cy.getBySel("profile-menu").click();
  //   cy.getBySel("profile").contains("Profile").click();
  //   cy.waitForPageLoad("/profile");

  //   cy.getBySel("dashboard").click();
  //   cy.waitForPageLoad("/dashboard");

  //   cy.getBySel("profile-menu").click();
  //   cy.getBySel("settings").contains("Settings").click();
  //   cy.waitForPageLoad("/settings");

  //   cy.getBySel("profile-menu").click();
  //   cy.getBySel("sign-out").contains("Sign out").click();
  //   cy.waitForPageLoad("/signin");
  // });
  
});
