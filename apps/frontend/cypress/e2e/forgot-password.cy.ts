describe("Forgot Password", function () {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("verifies blank field validation of forgot password page", () => {
    cy.get("#forgot-password")
      .should("be.visible")
      .should("be.enabled")
      .click();
    cy.contains("Email is required").should("be.visible");
  });

  it("verifies forgot password with unregistered email address", () => {
    cy.get("[name=email]").type("hfjwlr@yopmail.com");
    cy.get("#forgot-password")
      .should("be.visible")
      .should("be.enabled")
      .click();
    cy.contains("Try again.").should("be.visible");
  });

  it("verifies click forgot password button", () => {
    cy.get("[name=email]").type(Cypress.env("email"));
    cy.intercept("POST", "**/send-reset-link").as("sendResetMail");
    cy.get("#forgot-password")
      .should("be.visible")
      .should("be.enabled")
      .click();
    cy.wait("@sendResetMail");
    cy.contains("Password reset email sent!");
    cy.getBySel("back-to-login").should("exist").click();
  });

  it("verfies back to login link", () => {
    cy.get("a:contains(Back to Login)").should("have.attr", "href", "/signin");
  });
});
