describe("Profile Test", function () {
  const oldPassword = Cypress.env("pwd");
  const newPassword = Cypress.env("newPwd");

  before(function () {
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.fixture("profile").then(function (profile) {
      this.profile = profile;
    });
    cy.restoreLocalStorageCache();
    cy.visit("/profile/update-profile");
    cy.waitForPageLoad("/update-profile");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("verifies all the elements in the user profile page", () => {
    cy.contains("Profile").should("be.visible");
    // cy.contains("Billing Address").should("be.visible");
  });

  it("should update name field and organization field", function () {
    // cy.get("[name=firstName]").clear().type(this.profile.valid.firstName[0]);
    // cy.get("[name=lastName]").clear().type(this.profile.valid.lastName);
    // cy.get("[name=organization]").clear().type(this.profile.valid.org[0]);

    // Update Billing Address
    // cy.get('input[name="address1"]')
    //   .clear()
    //   .type(this.profile.valid.address_line_1);
    // cy.get('input[name="city"]').clear().type(this.profile.valid.city);
    // cy.get('input[name="state"]').clear().type(this.profile.valid.state);
    // cy.get('input[name="postalCode"]')
    //   .clear()
    //   .type(this.profile.valid.postalCode);
    // cy.get('select[name="country"]').select(this.profile.valid.country);

    // cy.get("#update-profile").should("be.visible").click();
    // cy.contains("Profile updated successfully").should("be.visible");

    // Update Name and Organization
    cy.get("[name=firstName]").clear().type(this.profile.valid.firstName[0]);
    cy.get("[name=lastName]").clear().type(this.profile.valid.lastName);
    cy.get("[name=organization]").clear().type(this.profile.valid.org[1]);
    cy.get("#update-profile").should("be.visible").click();
    cy.contains("Profile updated successfully").should("be.visible");
  });

  it("verifies name should be less than 32 chars, name doesn't accept numeric value, email field is disabled and organization doesn't accept special chars", function () {
    cy.get("[type=submit]").should("be.visible").should("be.disabled");
    cy.wait(500);
    cy.get("[name=firstName]").clear().type(this.profile.invalid.firstName);
    cy.get("[name=lastName]").clear().type(this.profile.invalid.lastName);
    cy.get("[name=organization]")
      .clear()
      .type(this.profile.invalid.org)
      .focus()
      .blur();
    cy.contains("First Name must be between 1 to 32 characters.").should(
      "be.visible"
    );
    cy.contains("Last name cannot accept only spaces" , {matchCase:false}).should("be.visible");
    cy.contains("Organization name is not valid").should("be.visible");
  });

  it("verifies old password and new password should not be same", () => {
    cy.getBySel("change-password").should("be.visible").click();
    cy.changePassword(oldPassword, oldPassword);
    cy.contains("Old and new password cannot be same");
  });

  it("verifies new password, confirm password should be same and password shouldn't be less than 8 chars", () => {
    cy.getBySel("change-password").should("be.visible").click();
    cy.changePassword(oldPassword, "1234567", "12345678");
    cy.contains("Password is too short - should be 8 chars minimum").should(
      "be.visible"
    );
    cy.contains("Both passwords need to be same").should("be.visible");
  });

  it("should update password", () => {
    cy.getBySel("change-password").should("be.visible").click();
    cy.changePassword(oldPassword, newPassword);
    cy.contains("Password updated successfully");

    // Revert back the password
    cy.updatePassword(oldPassword, newPassword);
  });
});
