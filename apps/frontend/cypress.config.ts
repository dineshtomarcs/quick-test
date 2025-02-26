import { defineConfig } from "cypress";


export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 786,
  
 

  retries: {
    runMode: 3,
    openMode: 0,
  },

  video: false,

  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
});

 
