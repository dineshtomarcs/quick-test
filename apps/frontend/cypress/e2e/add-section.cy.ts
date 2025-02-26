describe("Add section tests", function () {
  const sectionName = "Capture Bruce Banner";
  const sectionDescription =
    "Capture Bruce Banner and brief him about Avenger Initiative.";

  const invalidSectionName = "pneumonoultramicroscopicsilicovolcanoconiosis";
  beforeEach(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");

    const projectName = `Test Add Section - ${Cypress._.now()}`;
    cy.addProject(projectName).as("projectId");
    cy.get("@projectId").then((id) => cy.visit(`projects/${id}/testcases`));
    cy.waitForPageLoad("testcases");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(function () {
    cy.deleteProject(this.projectId);
    cy.visit("/dashboard");
  });

  it("verifies field validation of add new section", () => {
    cy.getBySel("add-section").click();
    cy.getBySel("section-modal")
      .should("be.visible")
      .within(() => {
        cy.getBySel("create-section-button").should("be.enabled").click();
        cy.contains("Name is required").should("be.visible");
        cy.get('input[type="text"][label="Name"]').type(invalidSectionName);
        cy.contains("Name should be maximum 32 characters").should(
          "be.visible"
        );
        cy.getBySel("cancel-section-button").click();
      });
    });

  it("should add,edit,delete section to group test cases", () => {
    cy.getBySel("add-section").click();
    cy.getBySel("section-modal")
      .should("be.visible")
      .within(() => {
        cy.get('input[type="text"][label="Name"]').type(sectionName);
        cy.get('textarea[type="text"][label="Description"]').type(
          sectionDescription
        );
        cy.intercept("GET", /\/projects\/.+\/sections/).as("sectionList");
        cy.getBySel("create-section-button")

          .should("be.enabled")
          .click();
      });
    cy.wait("@sectionList");
    cy.contains(sectionName).should("be.visible");
    cy.getBySel("section-0-edit").click();
    cy.getBySel("section-modal")
      .should("be.visible")
      .within(() => {
        cy.intercept("GET", /\/projects\/.+\/sections/).as("sectionList");
        cy.get('input[type="text"][label="Name"]')
          .clear()
          .type("[Success] " + sectionName);
        cy.get('textarea[type="text"][label="Description"]').clear();
        cy.getBySel("create-section-button").should("be.enabled").click();
      });
    cy.wait("@sectionList");
    cy.contains("[Success] " + sectionName).should("be.visible");
    cy.getBySel("section-0-delete").first().click();
    cy.getBySel("delete-button").click();
    cy.contains("Section deleted successfully");
  });

  // it("should edit section detail", () => {
   
  // });

  // it("should delete section", () => {
  //   cy.getBySel("project-0").click()
  //   cy.getBySel("test-cases-tab").click()
  //   cy.getBySel("section-0-delete").first().click();
  //   cy.getBySel("delete-button").click();
  //   cy.contains("Section deleted successfully");
  // });
});
