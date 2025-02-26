

Cypress.Commands.add("loginGUI", (email: string, password: string) => {
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("input[type=checkbox]").check();
  cy.get("#login-submit").click();
});

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("api_baseUrl")}/auth/login`,
    body: {
      email: Cypress.env("email"),
      password: Cypress.env("pwd"),
      remember_me: false,
    },
  }).then((resp: any) => {
    window.localStorage.setItem("token", resp.body.data.token.accessToken);
    window.localStorage.setItem("role", resp.body.data.user.role.roleType);
    window.localStorage.setItem(
      "allowedPermissions",
      JSON.stringify(resp.body.data.permissions)
    );
    window.localStorage.setItem(
      "subscriptionStatus",
      resp.body.data.user.subscriptionStatus
    );
    window.localStorage.setItem("firstLogin", JSON.stringify(true));
    window.localStorage.setItem("roleId", resp.body.data.user.role.id);
  });
});

Cypress.Commands.add("getPluginConfig", () => {
  cy.request({
    url: `${Cypress.env("api_baseUrl")}/plugins/config`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
  }).then((resp) => {
    window.localStorage.setItem(
      "isJiraIntegrated",
      resp.body.data.isIntegrated
    );
  });
});

Cypress.Commands.add("addProject", (name: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("api_baseUrl")}/projects`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
    body: {
      name: name,
    },
  }).then((resp) => {
    cy.wrap(resp.body.data.id);
  });
});

Cypress.Commands.add("deleteProject", (projectId: string) => {
  cy.request({
    method: "DELETE",
    url: `${Cypress.env("api_baseUrl")}/projects/${projectId}/delete`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
  });
});

Cypress.Commands.add(
  "updatePassword",
  (newPassword: string, oldPassword: string) => {
    cy.request({
      method: "PUT",
      url: `${Cypress.env("api_baseUrl")}/users/update-password`,
      auth: {
        bearer:
          window.localStorage.getItem("token") ||
          window.sessionStorage.getItem("token"),
      },
      body: {
        newPassword: newPassword,
        oldPassword: oldPassword,
      },
    });
  }
);

Cypress.Commands.add("addTestCase", (projectId: string) => {
  const testCaseObj = {
    title: "Testcase api",
    preconditions: "Testcase api",
    steps: "Testcase api",
    expectedResults: "Testcase api",
    executionPriority: "MEDIUM",
  };

  cy.request({
    url: `${Cypress.env("api_baseUrl")}/projects/${projectId}/sections`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
  }).then((resp: any) => {
    cy.wrap(resp.body.data.data[0].id).as("sectionId");
  });

  cy.get("@sectionId").then((sectionId) => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("api_baseUrl")}/projects/${projectId}/test-cases`,
      auth: {
        bearer:
          window.localStorage.getItem("token") ||
          window.sessionStorage.getItem("token"),
      },
      body: {
        sectionId: sectionId,
        testcase: testCaseObj,
      },
    }).then((resp: any) => {
      // return testcaseId created
      cy.wrap(resp.body.data.id);
    });
  });
});

Cypress.Commands.add("addSection", (projectId: string, name: string) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("api_baseUrl")}/projects/${projectId}/sections`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
    body: {
      name: name,
    },
  }).then((resp) => {
    cy.wrap(resp.body.data.id);
  });
});

Cypress.Commands.add("deleteSection", (projectId: string, sectionId) => {
  cy.request({
    method: "DELETE",
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
    url: `${Cypress.env(
      "api_baseUrl"
    )}/projects/${projectId}/sections/${sectionId}`,
  });
});

Cypress.Commands.add("addDefect", (testCaseId: string) => {
  cy.request({
    method: "PATCH",
    url: `${Cypress.env("api_baseUrl")}/defects/ref/testcase/${testCaseId}`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
    body: {
      pluginKey: Cypress.env("defectId"),
    },
  });
});

Cypress.Commands.add("updateJiraConfig", (payload: any) => {
  cy.request({
    url: `${Cypress.env("api_baseUrl")}/plugins/config`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
  }).then((resp) => {
    cy.wrap(resp.body.data.id).as("pluginConfigId");
  });

  cy.get("@pluginConfigId").then((pluginConfigId) => {
    cy.request({
      method: "PUT",
      url: `${Cypress.env("api_baseUrl")}/plugins/config/${pluginConfigId}`,
      auth: {
        bearer:
          window.localStorage.getItem("token") ||
          window.sessionStorage.getItem("token"),
      },
      body: payload,
    });
  });
});

Cypress.Commands.add(
  "signup",
  (firstName, lastName, email, organization, password, cnfPassword) => {
    cy.get("[name=firstName]").type(firstName, {force:true});
    cy.get("[name=lastName]").type(lastName);
    cy.get("[name=email]").type(email);
    cy.get("[name=org]").type(organization);
    cy.get("[name=password]").type(password);
    cy.get("[name=cnfpassword]").type(cnfPassword);
    cy.get("[name=termAndCondition]").check();
    cy.get("[id=sign-up]").click();
  }
);

Cypress.Commands.add("validateLogin", () => {
  cy.clearLocalStorageCache();
  cy.login();
  cy.log("User is logged in successfully.");
  cy.visit("/dashboard");
  cy.waitForPageLoad("/dashboard");
});

Cypress.Commands.add("createProject", (name, description) => {
  cy.get('input[label="Project Name"]').should("exist").clear().type(name);
  cy.get('textarea[label="Description"]')
    .should("exist")
    .clear()
    .type(description);
  cy.get("#project-create-edit").should("have.attr", "type", "submit").click();
});

Cypress.Commands.add(
  "changePassword",
  (oldPassword, newPassword, confirmNewPassword = newPassword) => {
    cy.get("[name=oldPassword]").clear().type(oldPassword);
    cy.get("[name=newPassword]").clear().type(newPassword);
    cy.get("[name=confirmPassword]").clear().type(confirmNewPassword);
    cy.get("[type=submit]").should("be.visible").click();
  }
);

Cypress.Commands.add(
  "addUser",
  (firstName: string, lastName: string, email: string) => {
    cy.getBySel("add-user").click();
    cy.waitForPageLoad("/add");
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('input[name="email"]').type(email);
    cy.get("#add-user-submit").should("be.enabled").click();
  }
);

Cypress.Commands.add("updateSubscriptionStatus", (status: string) => {
  cy.request({
    method: "PUT",
    url: `${Cypress.env("api_baseUrl")}/organizations/subscription-status`,
    auth: {
      bearer:
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token"),
    },
    body: {
      subscriptionStatus: status,
    },
  });
});
