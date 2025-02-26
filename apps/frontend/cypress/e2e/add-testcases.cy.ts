describe("Add testcase tests", function () {
  before(() => {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
    const projectName = `Test Add TestCase - ${Cypress._.now()}`;
    cy.addProject(projectName).as("projectId");
  });

  beforeEach(function () {
    cy.restoreLocalStorageCache();
    cy.fixture("testcase-data").then(function (testcaseData) {
      this.unassignedTestcase = testcaseData.unassignedTestcase;
      this.assignedTestcase = testcaseData.assignedTestcase;
      this.multipleTestcases = testcaseData.multipleTestcases;
    });
    cy.visit(`projects/${this.projectId}/testcases`);
    cy.waitForPageLoad("testcases");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(function () {
    cy.deleteProject(this.projectId);
    cy.visit("/dashboard");
  });

  it("verifies the blank field validation of Add new test case page", () => {
    cy.getBySel("new-test-case").click();
    cy.waitForPageLoad("/create-testcase");
    cy.getBySel("add-test-case").click();
    cy.contains("Title is required").should("be.visible");
    cy.contains("Preconditions are required").should("be.visible");
    cy.contains("Steps are required").should("be.visible");
    cy.contains("Expected Results are required").should("be.visible");
    cy.getBySel("cancel-form-submit").click();
  });

  it("should add test case by clicking on the New Test Case button (upper right corner)", function () {
    cy.getBySel("new-test-case").click();
    cy.waitForPageLoad("/create-testcase");
    const { title, preconditions, expectedResults, steps } =
      this.unassignedTestcase;
    cy.get('input[type="text"][label="Title"]').clear().type(title);
    cy.get('textarea[label="Preconditions"]').clear().type(preconditions);
    cy.get('textarea[label="Steps"]').clear().type(steps);
    cy.get('textarea[label="Expected Result"]').clear().type(expectedResults);
    cy.getBySel("add-test-case").click();
    cy.contains("Test Case created successfully");
    cy.waitForPageLoad("/testcases");
    cy.contains(title).should("be.visible");
  });

  it("should add test case under a specific section", function () {
    // Add a section Dummy
    const sectionName = "Dummy";
    cy.waitForPageLoad("/testcases");
    cy.addSection(this.projectId, sectionName).as("specificSectionId");
    cy.reload();
    cy.contains(sectionName).should("be.visible");

    // Add a testcase in Dummy Section
    cy.getBySel("section-0-add-case").click();
    cy.waitForPageLoad("/create-testcase");
    const { title, preconditions, expectedResults, steps } =
      this.assignedTestcase;
    cy.get('input[type="text"][label="Title"]').clear().type(title);
    cy.get('textarea[label="Preconditions"]').clear().type(preconditions);
    cy.get('textarea[label="Steps"]').clear().type(steps);
    cy.get('textarea[label="Expected Result"]').clear().type(expectedResults);
    cy.getBySel("add-test-case").click();

    cy.get("@specificSectionId").then((sectionId) =>
      // @ts-ignore
      cy.deleteSection(this.projectId, sectionId)
    );
  });

  it("should upload image in steps, preconditions and expected result fields", () => {
    cy.waitForPageLoad("/testcases");
    cy.getBySel("new-test-case").click();
    cy.waitForPageLoad("/create-testcase");
    cy.getBySel("add-test-case").click();
    cy.get('input[type="text"][label="Title"]').type(
      "Testcase with image test"
    );

    cy.intercept("POST", /\/projects\/image/).as("uploadImagePre");
    cy.get('textarea[label="Preconditions"]').selectFile(
      [
        "cypress/fixtures/images/pre-condition.png",
        "cypress/fixtures/images/test-result.jpg",
      ],
      {
        action: "drag-drop",
      }
    );
    cy.wait("@uploadImagePre");

    cy.intercept("POST", /\/projects\/image/).as("uploadImageSteps");
    cy.get('textarea[label="Steps"]').selectFile(
      "cypress/fixtures/images/steps.png",
      {
        action: "drag-drop",
      }
    );
    cy.wait("@uploadImageSteps");

    cy.intercept("POST", /\/projects\/image/).as("uploadImageExpectedResult");
    cy.get('textarea[label="Expected Result"]').selectFile(
      "cypress/fixtures/images/expected-result.png",
      { action: "drag-drop" }
    );
    cy.wait("@uploadImageExpectedResult");

    cy.getBySel("add-test-case").should("be.enabled").click();
    cy.contains("Test Case created successfully");
    cy.waitForPageLoad("/testcases");
    cy.contains("Testcase with image test").should("be.visible");
  });

  it("should update priority & section while editing a test case", function () {
    // Execute the action
    const sectionName = "Test Edit";
    cy.waitForPageLoad("/testcases");
    cy.addSection(this.projectId, sectionName).as("newSectionId");
    cy.addTestCase(this.projectId);
    cy.reload();
    cy.getBySel("section-0-case-0-edit").click();
    cy.waitForPageLoad("/edit-testcase");
    cy.getBySel("select-section").select(sectionName);
    cy.getBySel("select-priority").select("High");
    cy.getBySel("edit-test-case").should("be.enabled").click();

    // Delete Section
    cy.get("@newSectionId").then((sectionId) =>
      // @ts-ignore
      cy.deleteSection(this.projectId, sectionId)
    );
  });

  it("verifies the click functionality of 'Add & Next' button in Add new test case page", function () {
    cy.getBySel("section-0-add-case").click();
    cy.waitForPageLoad("/create-testcase");
    const multipleTestcases = this.multipleTestcases;
    cy.wrap(multipleTestcases).each((item: any) => {
      const { title, preconditions, expectedResults, steps } = item;
      cy.intercept("POST", /\/test-cases/).as("addTest");
      cy.get('input[type="text"][label="Title"]').clear().type(title);
      cy.getBySel("select-section").select("Unassigned");
      cy.get('textarea[label="Preconditions"]').clear().type(preconditions);
      cy.get('textarea[label="Steps"]').clear().type(steps);
      cy.get('textarea[label="Expected Result"]').clear().type(expectedResults);
      cy.getBySel("add-multiple-test-case").click();
      cy.wait("@addTest");
    });
    cy.getBySel("cancel-form-submit").click();
  });

  it("should delete multiple selected test cases", () => {
    for (let i = 0; i <= 3; i++) {
      // eslint-disable-next-line no-loop-func
      cy.then(() => {
        cy.getBySel("section-0-case-" + i + "-check").check();
      });
    }
    cy.getBySel("delete-multiple-test-case")
      .should("have.class", "text-indigo-600")
      .click();
    cy.getBySel("delete-button").click();
    cy.contains("deleted successfully");
  });
});
