describe("Add Test Run tests", function () {
  beforeEach(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
    const projectName = `Test Add TestRun - ${Cypress._.now()}`;
    cy.addProject(projectName).as("projectId");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
    cy.visit(`projects/${this.projectId}/testruns`);
    cy.waitForPageLoad("testruns");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  // after(function () {
  //   cy.deleteProject(this.projectId);
  //   cy.visit("/dashboard");
  // });

  it("should add test run", () => {
    cy.location("pathname").invoke("split", "/").its(2).as("projectId");
    // @ts-ignore
    cy.get("@projectId").then((id) => cy.addTestCase(id).as("testCaseId"));
    // @ts-ignore
    // cy.get("@testCaseId").then((id) => cy.addDefect(id));

    cy.getBySel("add-test-run").click();
    cy.waitForPageLoad("/create-testrun");
    cy.get('input[label="Name"]').clear().type("Test run #1");
    cy.get('input[label="Assign To"]').click();
    cy.getBySelLike("assignee").first().click();
    cy.getBySel("create-test-run").click();
    cy.contains("Test Add TestRun").click()

    // cy.get('[data-cy="back-button"]').click()
   // cy.contains("Test run #1").should("be.visible");
   //Edit
    cy.getBySelLike("test-run-0-edit").click();
    cy.waitForPageLoad("/edit-testrun");
    cy.get('input[label="Name"]').clear().type("Edited Test run #1");
    cy.getBySel("update-test-run").click();
    cy.waitForPageLoad("/testruns");
    cy.contains("Edited Test run #1").should("be.visible");
//delete

    cy.getBySelLike("test-run-0-delete").click();
    cy.getBySel("delete-button").click();
    cy.contains("deleted successfully").should("be.visible");

    
  
  });

  // it("should edit test run", () => {
    
  // cy.getBySel("test-run-0-edit").click();
  //   cy.waitForPageLoad("/edit-testrun");
  //   cy.get('input[label="Name"]').clear().type("Edited Test run #1");
  //   cy.getBySel("update-test-run").click();
  //   cy.waitForPageLoad("/testruns");
  //   cy.contains("Edited Test run #1").should("be.visible");
  //  });

  // it("should update the status of first testcase to passed", () => {
  //   cy.getBySel("test-run-0").click();
  //   cy.getBySelLike("three-dots-menu").first().click();
  //   cy.contains("Passed").should("be.visible").click();
  //   cy.get('input[type="checkbox"][name="addCommentJira"]').check();
  //   cy.getBySel("skip-and-submit").click();
  //   cy.contains("submitted successfully");
  // });

  // it("should add comment and update jira ticket on submission", () => {
  //   cy.getBySel("test-run-0").click();
  //   cy.getBySelLike("three-dots-menu").first().click();
  //   cy.contains("Failed").should("be.visible").click();
  //   cy.get('textarea[name="comment"]').type(
  //     `Status: Failed \n*${new Date().toString()}*`
  //   );
  //   cy.get('input[type="checkbox"][name="addCommentJira"]').check();
  //   cy.get("#submit-inside-popup").click();
  //   cy.contains("submitted successfully");
  // });

  // it("should delete Test run", () => {
  //   cy.getBySel("test-run-0-delete").click();
  //   cy.getBySel("delete-button").click();
  //   cy.contains("deleted successfully").should("be.visible");
  // });
});
