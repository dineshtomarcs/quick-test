
//<reference types=”cypress-xpath”/>

// https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/support/commands.ts
Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args);
});

// Cypress.Commands.add("getBySelLike", (selector, ...args) => {
//   return cy.get(`[data-cy*=${selector}]`, ...args);
// });

// https://blog.digital-craftsman.de/keep-local-storage-in-cypress/
let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorageCache", () => {
  Object.keys(localStorage).forEach((key) => {
    //@ts-ignore
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorageCache", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    //@ts-ignore
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("clearLocalStorageCache", () => {
  localStorage.clear();
  LOCAL_STORAGE_MEMORY = {};
});

Cypress.Commands.add("waitForPageLoad", (path) => {
  const pageTimeout = 10000;
  cy.location("pathname", { timeout: pageTimeout }).should("include", path);
});

Cypress.Commands.add("waitForSel", (selector, timeout) => {
  cy.get(`[data-cy=${selector}]`, { timeout: timeout }).should("be.visible");
});
