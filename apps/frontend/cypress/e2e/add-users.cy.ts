describe("Add Users Tests", function () {
  beforeEach(function () {
    cy.clearLocalStorageCache();
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/settings/users");
    cy.waitForPageLoad("/settings/users");
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should add new members", () => {
    cy.getBySel("add-user").click();
    cy.waitForPageLoad("/add");
    cy.get('input[name="firstName"]').type("Natasha");
    cy.get('input[name="lastName"]').type("Romanoff");
    cy.get('input[name="email"]').type("natasha.romanoff@yopmail.com");
    cy.get("#add-user-submit").should("be.enabled");
  });

  it("shouldn't allow to add user with existing user email", () => {
    cy.getBySel("add-user").click();
    cy.waitForPageLoad("/add");
    cy.get('input[name="firstName"]').type("Thor");
    cy.get('input[name="lastName"]').type("Odinson");
    cy.get('input[name="email"]').type("natasha.romanoff@yopmail.com");
    cy.get("#add-user-submit").should("be.enabled").click();
    cy.contains("already exists");
  });

  it("should add multiple users", () => {
    cy.getBySel("add-multiple-user").click();
    cy.waitForPageLoad("/add-multiple");
    cy.getBySel("textarea-multiple-user")
      .type("Loki, Laufeyson, loki.laufeyson@yopmail.com, Admin")
      .type("{enter}")
      .type("Thor, Laufeyson, thor.odinson@yopmail.com, Member");
    cy.get("#add-user-submit").should("be.enabled");
  });

  it("should update only user's name & title", () => {
    cy.getBySel("edit-user-0").click();
    cy.waitForPageLoad("/edit");
    cy.location().as("location");
    cy.get('input[name="firstName"]').clear().type("Donald");
    cy.get('input[name="lastName"]').clear().type("Blake");
    cy.get('input[name="email"]').should("be.disabled");
    cy.get('input[name="title"]').clear().type("Slayer of the Great Serpent");
    cy.get("#add-user-submit").should("be.enabled").click();
    cy.waitForPageLoad("/settings/users");
  });
});
