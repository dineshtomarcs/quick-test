describe("Add defect to TestCase", function () {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
    cy.getPluginConfig();
    const projectName = `Test Add TestCase Defect - ${Cypress._.now()}`;
    cy.addProject(projectName).as("projectId");
    // @ts-ignore
    cy.get("@projectId").then((id) => cy.addTestCase(id));
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
    cy.visit(`projects/${this.projectId}/testcases`);
    cy.waitForPageLoad("testcases");
    cy.getBySel("section-0-case-0-testcase").click();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(function () {
    cy.deleteProject(this.projectId);
    cy.visit("/dashboard");
  });

  it("verifies the Defect button in TestCase details page", () => {
    cy.getBySel("defect-btn").should("be.visible");
  });
  it("verifies all the elements in Add Reference Modal", () => {
    cy.getBySel("defect-btn").click();
    cy.getBySel("add-reference-btn").click();
    cy.get('input[name="summary"]').should("be.visible");
    cy.get('input[name="project"]').should("be.visible");
    cy.get('input[name="issueType"]').should("be.visible");
    cy.get('input[name="assignee"]').should("be.visible");
    cy.get('input[name="sprint"]').should("be.visible");
    cy.get('textarea[name="description"]').should("be.visible");
    cy.get("#submit-button").should("be.visible");
    cy.getBySel("cancel-btn").click();
  });
  it("should add defect to jira and map the same to the TestCase", () => {
    cy.intercept(/\/projects/).as("projects");
    cy.intercept("**/sprints?projectId=*").as("sprints");
    cy.getBySel("defect-btn").click();
    cy.getBySel("add-reference-btn").click();
    cy.wait("@projects");
    cy.get('input[name="project"]').click();
    cy.getBySel("project-0").click();
    cy.wait("@sprints");
    cy.get('input[name="issueType"]').click();
    cy.getBySel("issueType-dropdown").contains("Task").click();
    cy.get("#submit-button").click();
    cy.contains("successfully");
  });
  it("verifies all the elements in Map Reference Modal", () => {
    cy.getBySel("defect-btn").click();
    cy.getBySel("map-reference-btn").click();
    cy.get('input[name="project"]').should("be.visible");
    cy.get('input[name="defectId"]').should("be.visible");
    cy.get("#submit-button").should("be.visible");
    cy.getBySel("cancel-btn").click();
  });
  it("should map the JIRA defect to the TestCase", () => {
    cy.getBySel("defect-btn").click();
    cy.getBySel("map-reference-btn").click();
    cy.get('input[name="project"]').click();
    cy.intercept(/\/issues\?*/).as("defects");
    cy.getBySel("project-0").click();
    cy.wait("@defects");
    cy.get('input[name="defectId"]').click();
    cy.getBySel("defectId-0").click();
    cy.get("#submit-button").click();
    cy.contains("successfully");
  });
});
