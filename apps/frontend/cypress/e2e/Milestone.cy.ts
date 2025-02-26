import * as MilestonesData from "../fixtures/MilestonesData.json";

describe("Milestone Module", () => {
  beforeEach(() => {
    //Launch Browser and Enter Login Creds during each test
    cy.validateLogin();
    cy.updateSubscriptionStatus("active");
  });
  after(()=>{
    //Delete Created Milestone after execution of all Test cases 
    cy.get('.text-red-400.h-4.mr-3').eq(0).click()
    cy.get('[data-cy="delete-button"]').click()
    cy.get('.go2072408551').should('be.visible')
  })

  it("Verify all elements are Present on Page", () => {
    cy.contains("Projects").click();
    cy.get(`[data-cy="project-${MilestonesData.Select_Project.Projectindex}"]`).click();
    cy.get('[data-cy="milestones-tab"]').click()
    cy.get('#new-test-run').click()
    cy.get('[label="Name"]').should('be.visible').and('be.enabled')
    cy.get('#startDate').should('be.visible').and('be.enabled')
    cy.get('#endDate').should('be.visible').and('be.enabled')
    cy.get('[label="Description"]').should('be.visible').and('be.enabled')
    cy.get('#add-milestone').should('be.visible').and('be.enabled')
    cy.get('[data-cy="cancel-form-submit"]').should('be.visible').and('be.enabled')
  })

  it("Create Milestone using blank data", ()=>{
    cy.contains("Projects").click();
    cy.get(`[data-cy="project-${MilestonesData.Select_Project.Projectindex}"]`).click();
    cy.get('[data-cy="milestones-tab"]').click()
    cy.get('#new-test-run').click()
    cy.get('#add-milestone').click()
    cy.contains('Name is required').should('be.visible')
    cy.contains('Start Date is required').should('be.visible')
    cy.contains('End Date is required').should('be.visible')
    cy.contains('Description is required').should('be.visible')
  })

  it("Create Milestone", ()=>{
    cy.contains("Projects").click();
    cy.get(`[data-cy="project-${MilestonesData.Select_Project.Projectindex}"]`).click();
    cy.get('[data-cy="milestones-tab"]').click()
    cy.get('#new-test-run').click()
    cy.get('[label="Name"]').type(MilestonesData.ValidData.Name)
    cy.get('#startDate').click().then(()=>{
    cy.get(`[aria-label="Choose ${MilestonesData.ValidData.StartDayName}, ${MilestonesData.ValidData.StartMonth} ${MilestonesData.ValidData.StartDayNum}, ${MilestonesData.ValidData.StartYear}"]`).click()
    })
    cy.get('#endDate').click().then(()=>{
        cy.get(`[aria-label="Choose ${MilestonesData.ValidData.EndDayName}, ${MilestonesData.ValidData.EndMonth} ${MilestonesData.ValidData.EndDayNum}, ${MilestonesData.ValidData.EndYear}"]`).click()
    })
    cy.get('[label="Description"]').type(MilestonesData.ValidData.Description)
    cy.get('#add-milestone').click()
    cy.contains(MilestonesData.ValidData.Name)
  })
});
