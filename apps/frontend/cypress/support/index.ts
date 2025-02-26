import "./commands";
import "./bugplot";

// Hide all fetch/XHR requests in Cy console, toggle via cypress.json
// Refer: https://github.com/cypress-io/cypress/issues/7362
// Refer: https://dev.to/samelawrence/muting-noisy-xhr-logs-in-cypress-4495
if (Cypress.env("hideXHR")) {
  const app = window.top;

  if (!app?.document.head.querySelector("[data-hide-command-log-request]")) {
    const style = app?.document.createElement("style");
    if (style) {
      style.innerHTML =
        ".command-name-request, .command-name-xhr { display: none }";
      style?.setAttribute("data-hide-command-log-request", "");

      app?.document.head.appendChild(style);
    }
  }
}
