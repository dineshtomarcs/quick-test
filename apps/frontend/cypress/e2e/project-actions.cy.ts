describe("Project Actions tests", () => {
  const projectNameOne = `Kodiak - ${Cypress._.now()}`;
  const projectNameTwo = `Durango - ${Cypress._.now()}`;

  before(() => {
    cy.validateLogin();
    // cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/dashboard");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies different elements on New Project details page", () => {
    cy.getBySel("new-project").click({force:true});
    cy.get('input[label="Project Name"]').should("exist");
    cy.get('textarea[label="Description"]').should("exist");
    cy.get("#project-create-edit")
      .should("have.attr", "type", "submit")
      .should("be.visible")
      .should("be.enabled");
    cy.get("button:contains(Cancel)").should("be.enabled").click();
  });

  it("should be able create a new project successfully and verfies it", function () {
    cy.getBySel("new-project").click();
    cy.createProject(projectNameOne, projectNameOne + " : Description");
    cy.waitForPageLoad("/overview");
    cy.get('.text-gray-300').click()
    // cy.getBySel("back-button").click();
    // cy.intercept(/\/organizations\/projects/).as("projectList");
    // cy.waitForPageLoad("/dashboard");
    cy.contains(projectNameOne);
  });

  it("should not create a new project with already existing project name", function () {
    cy.getBySel("new-project").click();
    cy.createProject(projectNameOne, projectNameOne + " : Description");
    cy.contains("already exists").should("be.visible");
    cy.get("button:contains(Cancel)").should("be.enabled").click();
  });

  it("verifies view button is clickable and redirects to Overview page", () => {
    cy.visit("/projects")
   
    cy.xpath('//*[@id="headlessui-menu-button-:r0:"]').click()
    

      cy.contains("View").should("be.visible").click();

  
 

    cy.location("pathname").should("include", "/overview");
    cy.go("back");
  });

  it("should edit project detail", function () {
    cy.visit("/projects")

  cy.xpath('//*[@id="headlessui-menu-button-:r0:"]').click()
  cy.contains("Edit").should("be.visible").click();

    cy.waitForPageLoad("/edit-project");
    cy.createProject(projectNameTwo, projectNameTwo + " : Description");
   });

   it("should delete a project successfully", () => {
   cy.visit("/Projects")
  //   // cy.getBySel("three-dots-menu-0")
  //   //   .click()
  //   //   .within(() => {
  //   //     cy.contains("Archive").should("be.visible").click();
  //   //   });
  //   cy.getBySel("three-dots-menu-0")
  //    .click()
  // .should('exist')
  // .should('be.visible')
  // .should('contain', 'Archive');
  cy.xpath('//*[@id="headlessui-menu-button-:r0:"]').click()
  cy.contains("Archive").should("be.visible").click();
  
     
   cy.getBySel("confirm-button").should("be.visible").click();
  cy.contains("Project archived successfully");
  });
});
