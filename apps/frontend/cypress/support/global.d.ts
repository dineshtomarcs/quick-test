/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    getBySel(
      dataTestAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;
    getBySelLike(
      dataTestPrefixAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;

    /**
     *  Login user via GUI passing valid email and password
     */

    loginGUI(email: string, password: string): void;

    /**
     *  Login a user by saving the token in localStorage
     */
    login(): void;

    /**
     *  Login a user and redirect to dashboard
     */
    validateLogin(): void;

    /**
     *  Sign-up a user by passing required args
     */
    signup(
      firstName: string,
      lastName: string,
      email: string,
      organization: string,
      password: string,
      cnfPassword: string
    ): void;

    /**
     * Add TestCase to provided project and return created TestCaseId
     */
    addTestCase(projectId: string): void;

    /**
     * Add defect to provided Testcase
     */
    addDefect(testCaseId: string): void;

    /**
     * Add a project and returns projectId
     */
    addProject(name: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Delete a project provided projectId
     */
    deleteProject(projectId: string): void;

    /**
     * Get plugin config details and set isJiraInetgrated to localStorage
     */
    getPluginConfig(): void;

    /**
     * Update Jira configuration provided a payload object with accessToken, webAddress and userName
     */

    updateJiraConfig(payload: any): void;

    /**
     * Add section provided a name and projectId, returns sectionId
     */
    addSection(projectId: string, name: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Delete section provided projectId and sectionId
     */

    deleteSection(projectId: string, sectionId: string): void;

    /**
     * Update password of the user provided newPassword and oldPassword
     */
    updatePassword(newPassword: string, oldPassword: string): void;

    /**
     * Cypress automatically clears localStorage before each test to prevent state from being shared across tests.
     * Workaround: Saves localStorage data in a variable
     */
    saveLocalStorageCache(): void;

    /**
     * Restores localStorage data from the variable
     */
    restoreLocalStorageCache(): void;

    /**
     * Clears localStorage data
     */
    clearLocalStorageCache(): void;

    /**
     * Creates a project provided valid name and description
     */
    createProject(name: string, description: string): void;

    /**
     * Change password of a user
     */
    changePassword(
      oldPassword: string,
      newPassword: string,
      confirmNewPassword?: string
    ): void;

    /**
     * Waits for page to load before executing next action in a test
     */

    waitForPageLoad(path: string): void;

    /**
     *  Waits for a selector to show up in DOM before executing next action in a test
     */
    waitForSel(selector: string, timeout: number);

    /**
     *  Update organization susbscription status provided status value
     *  Valid Status: active, freeTrial, cancelled, cancelAtPeriodEnd
     */
    updateSubscriptionStatus(status: string): void;

    /**
     *  Add new users valid arguments(firstname, lastname, email, roleID)
     */
    addUser(firstName: string, lastName: string, email: string): void;

    /**
     *  Fills create test case form with provided data
     */

    fillTestcaseForm(
      title: string,
      preconditions: string,
      steps: string,
      expectedResults: string
    ): void;
  }
}
