describe("Archive project tests ", function () {
  const projectName = `Kodiak - ${Cypress._.now()}`;

  beforeEach(function () {
    cy.clearLocalStorageCache();
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies if user can archive project", () => {
    cy.visit("/projects");
    cy.waitForPageLoad("/projects");
    cy.getBySel("new-project").click();
    cy.createProject(projectName, projectName + " : Description");
    cy.waitForPageLoad("/overview");
    cy.visit("/projects");
    cy.waitForPageLoad("/projects");
    // cy.getBySelLike("three-dots-menu-0")
    //   .click({force: true})
    //   .within(() => {
    //     cy.contains("Archive").click({force: true})
    //   });
    cy.xpath('//*[@id="headlessui-menu-button-:r0:"]').click()
    cy.contains("Archive").should("be.visible").click();


    //  cy.getBySel("confirm-button").should("be.visible").click();
    //  cy.contains("Project archived successfully");


    cy.wait(4000)
    cy.contains("Are you sure you want to archive the project");
    cy.getBySel("confirm-button").click();
    cy.contains("Project archived successfully");
    cy.visit("/archived/projects");
    cy.waitForPageLoad("/archived/projects");
    cy.contains(projectName)
  });

  it("verifies if project is restored", () => {
    cy.visit("/archived/projects");
    cy.waitForPageLoad("/archived/projects");
    cy.get(':nth-child(1) > td.text-sm > [value="restore"]').click()
    // cy.contains(projectName)
    //   .parent()
    //   .parent()
    //   .within(() => {
    //     cy.getBySel("confirm-button").should("be.enabled").click();
    //   });
    cy.contains("Are you sure you want to restore the project");
    cy.getBySel("confirm-button").should("be.enabled").click();
    cy.contains("Project restored successfully");
    cy.xpath('//a[text()="Projects"]').click()
    // cy.visit("/dashboard");
    // cy.waitForPageLoad("/dashboard");
    cy.contains(projectName);
  });

  it("verifies if project is deleted", () => {
    cy.visit("/projects");
    cy.waitForPageLoad("/projects");
    cy.contains(projectName);
    cy.xpath('//*[@id="headlessui-menu-button-:r0:"]').click()
    cy.contains("Archive").should("be.visible").click();
    cy.contains("Are you sure you want to archive the project");
    cy.getBySel("confirm-button").should("be.enabled").click();
    cy.contains("Project archived successfully");
    cy.visit("/archived/projects");
    cy.waitForPageLoad("/archived/projects");

    cy.contains(projectName)
      .parent()
      .parent()
      .within(() => {
        cy.get("td").last().get("button").last().click();
      });

    cy.contains("Are you sure you want to delete the project");
    cy.getBySel("delete-button").click();
    cy.contains("Project deleted successfully")
    cy.waitForPageLoad("/archived/projects");
    cy.should("not.contain", projectName);
    cy.visit("/dashboard");
    cy.waitForPageLoad("/dashboard");
    cy.should("not.contain", projectName);
  });

});
