describe("Signup test", function () {
  beforeEach(() => {
    cy.visit("http://localhost:3000/signup");
  });

  it("verifies all the elements in the sign up page", () => {
    cy.contains("Get started with Quick Test");
    cy.get('input[label="First Name"]').should("exist");
    cy.get('input[label="Last Name"]').should("exist");
    cy.get('input[label="Work Email"]').should("exist");
    cy.get('input[label="Organization"]').should("exist");
    cy.get('input[label="Password"]').should("exist");
    cy.get('input[label="Confirm Password"]').should("exist");
    cy.get('input[type="checkbox"][name="termAndCondition"]').should("exist");
    cy.get('button[type="submit"]')
      .contains("Sign Up")
      .should("exist")
      .should("be.enabled");
    cy.get("a:contains(Login)").should("have.attr", "href", "/signin");
  });

  it("verifies the blank field validation of signup page", () => {
    cy.get("[id=sign-up]").click();
    cy.contains("Please accept Terms of Use & Privacy Policy").should("exist");
  });

  it("should not signup with invalid credentials ", () => {
    cy.fixture("invalid-signup.json").then((user) => {
      cy.signup(
        user.firstName,
        user.lastName,
        user.email,
        user.org,
        user.password,
        user.cnfPassword
      );
    });
    cy.contains("First Name must be between 1 to 32 characters.").should(
      "be.visible"
    );
    cy.contains("Last Name cannot accept only spaces").should("be.visible");
    cy.contains("Email is not valid").should("be.visible");
    cy.contains("Organization name is not valid").should("be.visible");
    cy.contains("Password is too short - should be 8 chars minimum").should(
      "be.visible"
    );
    cy.contains("Both passwords need to be same").should("be.visible");
  });

  it("should signup with valid credentials ", () => {
    cy.fixture("valid-signup.json").then((user) => {
      cy.signup(
        user.firstName,
        user.lastName,
        user.email,
        user.org,
        user.password,
        user.cnfPassword
      );
    });
  });

  it("should not sign up with already taken email id", () => {
    cy.fixture("valid-signup.json").then((user) => {
      cy.signup(
        user.firstName,
        user.lastName,
        user.email,
        user.org,
        user.password,
        user.cnfPassword
      );
    });
    cy.contains("password must be a strong password").should("be.visible");
  });

  it("verifies navigation to login page from sign up page ", () => {
    cy.get("a:contains(Login)").should("have.attr", "href", "/signin");
  });
});
